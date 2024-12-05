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
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

# Load environment variables
load_dotenv()

from backend.database import get_db
from backend.models import User
from backend.schemas import UserCreate, Token, GoogleSignUp, SocialLogin

# Initialize Firebase Admin
cred = credentials.Certificate("backend/mirror-66aec-firebase-adminsdk-p287z-a39b09a48c.json")
firebase_admin.initialize_app(cred)

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
        # Verify the Firebase ID token
        decoded_token = firebase_auth.verify_id_token(auth_data.idToken)
        
        # Get user info from the verified token
        email = decoded_token['email']
        if not decoded_token.get('email_verified', False):
            raise ValueError('Email not verified by Google.')
            
        name = decoded_token.get('name', '')

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
            detail=f"Invalid token: {str(e)}"
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
        print(f"Verifying token: {auth_data.token[:20]}...")  # Log first 20 chars of token
        # Verify the token with Google
        response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={auth_data.token}"
        )
        print(f"Google API response status: {response.status_code}")
        
        if not response.ok:
            error_detail = response.json() if response.content else "No error details available"
            print(f"Google API error: {error_detail}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Google token: {error_detail}"
            )
        
        token_info = response.json()
        print(f"Token info received: {token_info}")
        
        # Check if user exists
        user = db.query(User).filter(User.email == auth_data.email).first()
        
        if not user:
            print(f"Creating new user with email: {auth_data.email}")
            # Create new user
            user = User(
                email=auth_data.email,
                name=auth_data.name,
                provider="Google"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            print(f"Found existing user: {user.email}")
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user.email}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    except Exception as e:
        print(f"Error in social_auth: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )