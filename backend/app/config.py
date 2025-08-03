from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import Any
import os


class Settings(BaseSettings):
    # Database
    DB_HOST: str = os.environ.get("DB_HOST")
    DB_PORT: str = os.environ.get("DB_PORT")
    DB_USER: str = os.environ.get("DB_USER")
    DB_PASSWORD: str = os.environ.get("DB_PASSWORD")
    DB_NAME: str = os.environ.get("DB_NAME")

    # Email
    MAIL_SERVER: str = os.environ.get("MAIL_SERVER")
    MAIL_PORT: str = os.environ.get("MAIL_PORT")
    MAIL_USERNAME: str = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD: str = os.environ.get("MAIL_PASSWORD")
    MAIL_USE_TLS: bool = os.environ.get("MAIL_USE_TLS")
    MAIL_USE_SSL: bool = os.environ.get("MAIL_USE_SSL")
    MAIL_DEFAULT_SENDER: str = os.environ.get("MAIL_DEFAULT_SENDER")

    # JWT
    SECRET_KEY: str = os.environ.get("SECRET_KEY")
    REFRESH_SECRET_KEY: Any = os.environ.get("REFRESH_SECRET_KEY")
    ALGORITHM: str = os.environ.get("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES")
    PSW_TOKEN_EXPIRE_MINUTES: int = os.environ.get("PSW_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = ".env"

settings = Settings()