from fastapi import Depends, status, HTTPException
from jose import JWTError, jwt
from datetime import datetime, timedelta

from .db import database, models
from . import schemas
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .config import settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_SECRET_KEY = settings.REFRESH_SECRET_KEY
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
PSW_TOKEN_EXPIRE_MINUTES = settings.PSW_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        id = payload.get("user_id")

        if id is None:
            raise credentials_exception
        token_data = schemas.TokenData(id=str(id))
    except JWTError:
        raise credentials_exception
    
    return token_data

def verify_refresh_token(token: str):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",
                                          headers={"WWW-Authenticate": "Bearer"})    
    try:
        payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])

        id = payload.get("user_id")

        if id is None:
            raise credentials_exception
        token_data = schemas.TokenData(id=str(id))
    except JWTError:
        raise credentials_exception
    
    return token_data


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    
    token = verify_access_token(token, credentials_exception)

    user = db.query(models.Users).filter(models.Users.id == token.id).first()
    
    return user


# Password reset token
def create_reset_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=PSW_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


#Verify reset token
def verify_reset_token(token: str, db: Session = Depends(database.get_db)):
    exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not validate credentials",
                            headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Get user id from the payload
        id = payload.get("user_id")
        if id is None:
            raise exception
        else:
            # return user
            user = db.query(models.Users).filter(models.Users.id == token.id).first()
            return user

    except JWTError:
        raise exception


# User role check
class CheckRoles:
    def __init__(self, roles: list[str]) -> None:
        self.required_roles = roles

    def __call__(self, current_user = Depends(get_current_user), db: Session = Depends(database.get_db)) -> bool:
        user = db.query(models.Users).filter(models.Users.id == current_user.id).first()
        if user.roles.name not in self.required_roles:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Insufficient Permission.")
        
        return True