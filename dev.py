#!/usr/bin/env python3

import subprocess
import sys
import os
import time
from pathlib import Path

def check_dependencies():
    """Check if all required dependencies are installed."""
    try:
        import uvicorn
        import fastapi
        print("✅ Backend dependencies found")
    except ImportError:
        print("❌ Backend dependencies missing. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

    # Check if node_modules exists
    if not Path("node_modules").exists():
        print("❌ Frontend dependencies missing. Installing...")
        subprocess.run(["npm", "install"], check=True)
    else:
        print("✅ Frontend dependencies found")

def start_backend():
    """Start the FastAPI backend server."""
    return subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--reload", "--port", "8000"],
        env={**os.environ, "PYTHONPATH": os.getcwd()}
    )

def start_frontend():
    """Start the Next.js frontend server."""
    return subprocess.Popen(
        ["npm", "run", "dev"],
        env={**os.environ, "PORT": "3000"}
    )

def main():
    # Ensure we're in the project root directory
    project_root = Path(__file__).parent
    os.chdir(project_root)

    print("🚀 Starting Mirror development environment...")
    
    # Check and install dependencies
    try:
        check_dependencies()
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)

    # Start backend
    print("\n📡 Starting backend server...")
    backend_process = start_backend()
    time.sleep(2)  # Give the backend a moment to start

    # Start frontend
    print("\n🎨 Starting frontend server...")
    frontend_process = start_frontend()

    print("\n🌟 Development servers are running!")
    print("   Frontend: http://localhost:3000")
    print("   Backend:  http://localhost:8000")
    print("\n📝 Press Ctrl+C to stop both servers")

    try:
        # Keep the script running and wait for keyboard interrupt
        backend_process.wait()
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down development servers...")
        backend_process.terminate()
        frontend_process.terminate()
        
        # Wait for processes to terminate
        backend_process.wait()
        frontend_process.wait()
        
        print("✨ Development servers stopped")

if __name__ == "__main__":
    main()
