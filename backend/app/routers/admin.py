import logging
from fastapi import APIRouter, status, HTTPException, Depends, BackgroundTasks, Request, Response
from sqlalchemy.orm import Session
from ..db import models
from .. import schemas, utils, oauth2
from ..db.database import get_db
from ..email import send_email_message


logger = logging.getLogger("trackerLogger") 
router = APIRouter(
    prefix="/admin",
    tags=["Administrator"]
)


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut,)
def register(user: schemas.UserCreate, bg_tasks: BackgroundTasks, db: Session = Depends(get_db), authorize: bool = Depends(oauth2.CheckRoles(['admin']))):  
# def register(user: schemas.UserCreate, bg_tasks: BackgroundTasks, db: Session = Depends(get_db)):  

    to_email = schemas.UserMail(email=user.email, username=user.username, fullname=user.fullname, password=user.password)

    # Check for existing username and employee ID
    validate_username = db.query(models.Users).filter(models.Users.username == user.username).first()
    if validate_username:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exist.")

    validate_employee_id = db.query(models.Users).filter(models.Users.employee_id == user.employee_id).first()
    if validate_employee_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee ID already exist.")


    # Hash the password
    password_hash = utils.hash(user.password)
    user.password = password_hash

    # Add new user
    new_user = models.Users(**user.model_dump())
    db.add(new_user)
    db.commit()

    #Send email in the background
    bg_tasks.add_task(send_email_message, "Registration", [to_email.email], to_email.model_dump(), "registration.html")
    logger.info(f"New User: {new_user.username}, role: {new_user.user_role}")

    return new_user


# Delete a Tool
# TODO 
@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tool(id: int, db: Session = Depends(get_db), authorize: bool = Depends(oauth2.CheckRoles(['admin']))):
    pass


# Reset a user based on username
@router.post('/user-reset')
def user_reset(data: schemas.UserReset, bg_task: BackgroundTasks, req: Request, db: Session = Depends(get_db), authorize: bool = Depends(oauth2.CheckRoles(['admin']))):
    user = db.query(models.Users).filter(models.Users.username == data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User does not exist.')
    else:
        new_password = utils.hash(data.password)
        user.password = new_password
        user.verified = False
        db.commit()
         # Send an email notification to the user
        # print({"username": user.username, "password": data.password})
        bg_task.add_task(send_email_message, "Password Reset", [user.email], {"username": user.username, "password": data.password}, "user_reset.html")
        return {'message': 'User password has been reset'}
        

@router.get('/fix')
async def fix_fields():

    await send_email_message("Test Email", ["pal.bence13@gmail.com"], {"message": "Hello Email."}, "test_mail.html")

    return {'message': 'ok'}