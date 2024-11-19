from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleSignUp(BaseModel):
    email: EmailStr
    name: str
    provider: str
    idToken: str

class User(UserBase):
    id: int
    provider: Optional[str] = None

    class Config:
        from_attributes = True
