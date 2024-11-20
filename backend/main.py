# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth
from backend.database import Base, engine

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js development server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include the routers
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mirror App API"}