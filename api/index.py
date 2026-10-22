import os
import sys

# Ensure backend directory takes priority over any root files
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(root_dir, "backend")

# Remove root_dir from sys.path if present so app.py doesn't shadow backend/app package
while root_dir in sys.path:
    sys.path.remove(root_dir)

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the FastAPI application from backend/app/main.py
from app.main import app
