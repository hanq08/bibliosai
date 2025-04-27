#!/usr/bin/env python3
"""
Initialize the project directory structure for BibliosAI.
This script creates the necessary directories and empty __init__.py files.
"""

import os
import sys
from pathlib import Path

def create_directory(path):
    """Create directory if it doesn't exist."""
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")
    else:
        print(f"Directory already exists: {path}")

def create_init_file(path):
    """Create an empty __init__.py file if it doesn't exist."""
    init_file = os.path.join(path, "__init__.py")
    if not os.path.exists(init_file):
        with open(init_file, "w") as f:
            f.write("# Package initialization\n")
        print(f"Created file: {init_file}")
    else:
        print(f"File already exists: {init_file}")

def main():
    """Main function to initialize the project structure."""
    # Get the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Define the directory structure
    directories = [
        "backend",
        "backend/api",
        "backend/auth",
        "backend/connectors",
        "backend/embedding",
        "backend/actions",
        "backend/utils",
        "docs",
        "scripts",
        "frontend/public",
        "frontend/src",
        "frontend/src/components",
        "frontend/src/contexts",
        "frontend/src/pages",
        "frontend/src/services",
    ]
    
    # Create directories and __init__.py files
    for directory in directories:
        dir_path = os.path.join(project_root, directory)
        create_directory(dir_path)
        
        # Create __init__.py files in Python package directories
        if directory.startswith("backend"):
            create_init_file(dir_path)
    
    print("\nProject structure initialized successfully!")
    print("Next steps:")
    print("1. Install backend dependencies: pip install -r requirements.txt")
    print("2. Install frontend dependencies: cd frontend && npm install")
    print("3. Set up environment variables in .env file")
    print("4. Start the backend server: python run.py")
    print("5. Start the frontend development server: cd frontend && npm start")

if __name__ == "__main__":
    main()
