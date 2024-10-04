from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie, Request
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from fastapi import Request, BackgroundTasks
from datetime import datetime, timezone
from ..email import send_email_message
from .. import schemas, utils, oauth2
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..config import settings
from typing import Optional
from ..db import models
import logging


logger = logging.getLogger("trackerLogger")
router = APIRouter(
    tags=['Authentication'],
)


@router.post('/login')
def login(response: Response, request: Request, 
          credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    user = db.query(models.Users).filter(models.Users.username == credentials.username).first()

    # Check if user exist
    if not user:
        # logger.info(f"{request.client.host} - Failed login attempt")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    
    # Verify password
    if not utils.verify(credentials.password, user.password):
        # logger.info(f"{request.client.host} - Failed login attempt")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")
    
    # Create Access Token
    access_token = oauth2.create_access_token(data={"user_id": user.id})

    # Create Refresh Token
    refresh_token = oauth2.create_refresh_token(data={"user_id": user.id})

    # Update 'last_login' field
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    # Refresh Token sent as a cookie
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True)

    login_response = schemas.UserLogin(username=user.username, fullname=user.fullname, 
                                       role=user.roles.name, access_token=access_token, verified=user.verified)

    # Return JWT Token
    logger.info(f"{request.client.host} - Successful login: {user.username}")
    return login_response
    

# Change password. Requres  user to be logged in
@router.put('/password-change', response_model=schemas.UserOut)
def change_password(data: schemas.ChangePassword, req: Request, bg_task: BackgroundTasks, 
                    db: Session = Depends(get_db), current_user = Depends(oauth2.get_current_user)):
    user = db.query(models.Users).filter(models.Users.id == current_user.id).first()
    if not user:
        # logger.info(f"{req.client.host} - Failed password change attempt")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist.")
    
    if data.password != data.password2:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Passwords do not match")
    else:
        # Hash the new password
        new_password = utils.hash(data.password)

        if (user.verified == False):
            user.verified = True

        # Store the new password in DB and sent a notification
        user.password = new_password
        db.commit()
        logger.info(f"{req.client.host} - Password changed for for user: {user.username}")
        bg_task.add_task(send_email_message, "Password Change", [user.email], {"username": user.username}, "password_reset_notif.html")

        return user


# Generate a password reset link
# Send the link to the users email address if user exists
# TODO fix the link sent in email
@router.post("/password-reset")
def send_password_reset_email(data: schemas.GetEmail, request: Request, 
    bg_task: BackgroundTasks, db: Session = Depends(get_db)):
    
    # Get a user based on email address
    user = db.query(models.Users).filter(models.Users.email == data.email).first()
    if user:
        # Generate a JWT token
        reset_token = oauth2.create_reset_token(data={"user_id": user.id})
        reset_link = f"http://localhost:{request.client.port}/user/password-reset/{reset_token}"

        # Send email in the background
        # print(reset_link)
        bg_task.add_task(send_email_message, "Password Reset", [user.email], {"url": reset_link}, "password_reset.html")
        logger.info(f"{request.client.host} - Password reset email sent for user: {user.username}")

    return {"message": "Check your email messages to set up a new password."}


# Reset a users password
@router.put("/password-reset/{token}", response_model=schemas.UserOut)
def reset_password(token: str, req: Request, data: schemas.ChangePassword, db: Session = Depends(get_db)):
    # Verify the reset token
    user_data = oauth2.verify_reset_token(token)
    
    # Check for user in db
    check_user = db.query(models.Users).filter(models.Users.id == user_data.id).first()
    if check_user:
        if data.password != data.password2:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Passwords do not match")
        else:
            new_password = utils.hash(data.password)
            check_user.password = new_password
            db.commit()
            logger.info(f"{req.client.host} - Password changed for for user: {check_user.username}")

        return check_user


# Refresh the access token
@router.get('/refresh')
def refresh(refresh_token: Optional[str] = Cookie(None), db: Session = Depends(get_db)):

    # print(refresh_token)
    if refresh_token == None:
        return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No refresh token.")
    data = oauth2.verify_refresh_token(token=refresh_token)

    #Check if user exist
    user = db.query(models.Users).filter(models.Users.id == data.id).first()
    if user: 
        new_access_token = oauth2.create_access_token({"user_id": data.id})
    else:
        return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found.')
    
    # Response
    refresh_response = schemas.UserLogin(username=user.username, fullname=user.fullname, 
                                         role=user.roles.name, verified=user.verified,
                                         access_token=new_access_token)

    return refresh_response

# User logout endpoint
@router.get('/logout')
def logout(response: Response, req: Request, db: Session = Depends(get_db), current_user = Depends(oauth2.get_current_user)):
    user = db.query(models.Users).filter(models.Users.id == current_user.id).first()

    response.delete_cookie(key="refresh_token")
    logger.info(f"{req.client.host} - logged out from user: {user.username}")

    return {"message": "You are now logged out."}