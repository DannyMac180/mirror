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

class SocialLogin(BaseModel):
    provider: str  # Only "Google" is supported
    token: str
    email: EmailStr
    name: str

class User(UserBase):
    id: int
    provider: Optional[str] = None

    class Config:
        from_attributes = True
