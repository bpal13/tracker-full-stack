from pydantic import BaseModel, EmailStr, Field
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


# OAuth2 token

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None 



# User Schemas
class Role(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    fullname: str
    password: str
    employee_id: int
    user_role: int


class UserOut(BaseModel):
    id: int
    fullname: str
    username: str
    email: EmailStr
    registered: datetime
    roles: Role
    verified: bool

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    fullname: str
    role: str
    access_token: str
    verified: bool

    class Config:
        from_attributes = True


class UserToolOut(BaseModel):
    id: int
    fullname: str

    class Config:
        from_attributes = True


class ChangePassword(BaseModel):
    password: str
    password2: str    


#Email Schema
class EmailSchema(BaseModel):
    email: List[EmailStr]
    body: Optional[dict] | None


class GetEmail(BaseModel):
    email: EmailStr


class UserMail(BaseModel):
    email: EmailStr
    username: str
    fullname: str
    password: str

    
# Tool Schemas
class ToolCreate(BaseModel):
    status: str
    tool_id: str
    tool_name: str
    tool_location: str
    tool_type: str
    tool_brand: str
    tool_serial: str
    tool_accuracy: str
    tool_range: str
    max_deviation: str
    notes: Optional[str] = None


class ToolOut(ToolCreate):
    issue_date: datetime
    id: int
    owner: UserToolOut
    valid_until: Optional[datetime]

    class Config:
        from_attributes = True


class ToolUpdate(BaseModel):
    tool_id: str | int
    tool_name: str
    tool_location: str
    tool_type: str
    tool_brand: str
    tool_serial: str
    tool_accuracy: str
    tool_range: str
    max_deviation: str
    notes: Optional[str] = None


    class Config:
        from_attributes = True



# Calibration Schemas
class CalibCreate(BaseModel):
    rating: str
    temperature: int
    actual_deviation: str
    etalon: Optional[str] = None
    KULSO_I_A: float = Field(default=0)
    KULSO_II_A: float = Field(default=0)
    KULSO_III_A: float = Field(default=0)
    KULSO_I_B: float = Field(default=0)
    KULSO_II_B: float = Field(default=0)
    KULSO_III_B: float = Field(default=0)
    KULSO_I_C: float = Field(default=0)
    KULSO_II_C: float = Field(default=0)
    KULSO_III_C: float = Field(default=0)
    BELSO_I_A: float = Field(default=0)
    BELSO_II_A: float = Field(default=0)
    BELSO_III_A: float = Field(default=0)
    BELSO_I_B: float = Field(default=0)
    BELSO_II_B: float = Field(default=0)
    BELSO_III_B: float = Field(default=0)
    BELSO_I_C: float = Field(default=0)
    BELSO_II_C: float = Field(default=0)
    BELSO_III_C: float = Field(default=0) 
    hasab: Optional[str] = None
    ring: Optional[str] = None
    calib_notes: Optional[str] = None


class CalibOut(CalibCreate):
    id: int
    parent_id: int
    calibration_date: datetime
    next_calibration: datetime
    calibration_by: str

    class Config:
        from_attributes = True


# Admin page schemas
class UserReset(BaseModel):
    username: str
    password: str


# Statistics schema
class StatsOut(BaseModel):
    status_data: dict
    loc_data: dict