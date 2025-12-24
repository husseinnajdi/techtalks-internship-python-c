
import sys
import os
import asyncio
from unittest.mock import MagicMock, patch

# Add root to path
sys.path.append(os.getcwd())

# Mock firebase_config
sys.modules["app.firebase_config"] = MagicMock()
sys.modules["app.firebase_config"].auth = MagicMock()

# Mock database
sys.modules["app.database"] = MagicMock()
sys.modules["app.database"].database = MagicMock()

# Import
from fastapi import HTTPException
from app.router.auth import get_current_user
from fastapi.security import HTTPAuthorizationCredentials

async def run_verification():
    print("Starting verification of auth dependency...")

    mock_auth = sys.modules["app.firebase_config"].auth
    
    # Test 1: Valid Token
    print("Test 1: Valid Token")
    mock_auth.verify_id_token.return_value = {"uid": "test_uid", "email": "test@test.com"}
    
    creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid_token")
    user = await get_current_user(creds)
    
    if user["uid"] == "test_uid":
        print("[PASS] User returned correctly.")
    else:
        print("[FAIL] User mismatch.")

    # Test 2: Invalid Token
    print("Test 2: Invalid Token")
    mock_auth.verify_id_token.side_effect = Exception("Invalid token")
    
    try:
        await get_current_user(creds)
        print("[FAIL] Should have raised HTTPException")
    except HTTPException as e:
        if e.status_code == 401:
            print("[PASS] Raised 401 as expected.")
        else:
            print(f"[FAIL] Raised {e.status_code} instead of 401.")
    except Exception as e:
        print(f"[FAIL] Raised wrong exception type: {type(e)}")

    print("Verification completed.")

if __name__ == "__main__":
    asyncio.run(run_verification())
