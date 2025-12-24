import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

print(f"Running verification from: {os.getcwd()}")

try:
    # Try importing main to check for import errors and initialization errors
    from app.main import app
    print("SUCCESS: Successfully imported app.")
except FileNotFoundError as e:
    print(f"FAILURE: File not found error: {e}")
except ImportError as e:
    print(f"FAILURE: Import error: {e}")
except Exception as e:
    print(f"FAILURE: Unexpected error: {e}")
