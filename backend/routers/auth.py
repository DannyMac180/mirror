from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
import requests
from jose import jwt
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from backend.database import get_db
from backend.models import User
from backend.schemas import UserCreate, Token, GoogleSignUp, SocialLogin

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Google OAuth settings
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": db_user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google-signup", response_model=Token)
async def google_signup(auth_data: GoogleSignUp, db: Session = Depends(get_db)):
    try:
        # Create a Request object with caching disabled
        request = google_requests.Request(session=requests.Session())
        
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            auth_data.idToken,
            request,
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )

        # Verify issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
            
        # Get user info from the verified token
        email = idinfo['email']
        if not idinfo.get('email_verified', False):
            raise ValueError('Email not verified by Google.')
            
        name = idinfo.get('name', '')

        # Check if user already exists
        db_user = db.query(User).filter(User.email == email).first()
        
        if not db_user:
            # Create new user
            db_user = User(
                email=email,
                name=name,
                provider="google"
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        # Create access token
        access_token = create_access_token(
            data={"sub": email}
        )
        
        return {"access_token": access_token, "token_type": "bearer"}

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during Google signup: {str(e)}"
        )

@router.post("/social-auth", response_model=Token)
async def social_auth(auth_data: SocialLogin, db: Session = Depends(get_db)):
    if auth_data.provider != "Google":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only Google authentication is supported"
        )
    
    try:
        # Verify the token with Google
        response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={auth_data.token}"
        )
        if not response.ok:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
        token_info = response.json()
        
        # Check if user exists
        user = db.query(User).filter(User.email == auth_data.email).first()
        
        if not user:
            # Create new user
            user = User(
                email=auth_data.email,
                name=auth_data.name,
                provider="Google"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.email}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )