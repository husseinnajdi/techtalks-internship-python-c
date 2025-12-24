
import sys
import os
import asyncio
from unittest.mock import MagicMock, patch

# Add root to path
sys.path.append(os.getcwd())

# Mock firebase_config before importing auth
sys.modules["app.firebase_config"] = MagicMock()
sys.modules["app.firebase_config"].auth = MagicMock()

# Mock database before importing auth
sys.modules["app.database"] = MagicMock()
sys.modules["app.database"].database = MagicMock()
sys.modules["app.database"].User_table = MagicMock()

# Now import the router
from app.router.auth import signup, UserSignup

async def run_verification():
    print("Starting verification of signup flow...")

    # Setup mocks
    mock_auth = sys.modules["app.firebase_config"].auth
    mock_db = sys.modules["app.database"].database
    mock_user_table = sys.modules["app.database"].User_table
    
    # Mock Firebase create_user
    mock_user_record = MagicMock()
    mock_user_record.uid = "test_firebase_uid"
    
    # Mock Exception class
    class MockEmailExistsError(Exception):
        pass
    mock_auth.EmailAlreadyExistsError = MockEmailExistsError
    
    mock_auth.create_user.return_value = mock_user_record

    # Mock DB insert
    mock_insert = MagicMock()
    mock_values = MagicMock()
    mock_user_table.insert.return_value = mock_insert
    mock_insert.values.return_value = "MOCKED_QUERY"
    
    # Mock DB execute
    mock_db.execute = MagicMock()
    future = asyncio.Future()
    future.set_result(None)
    mock_db.execute.return_value = future

    # Test data
    user_data = UserSignup(
        email="test@example.com",
        password="securePassword123", # Password used for Firebase only
        name="Test User"
    )

    print(f"Testing signup for: {user_data.email}")

    # Call the function
    try:
        response = await signup(user_data)
        print("Signup function returned:", response)
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"ERROR: Signup function failed with: {repr(e)}")
        return

    # Verify Firebase call
    mock_auth.create_user.assert_called_once_with(
        email="test@example.com",
        password="securePassword123",
        display_name="Test User"
    )
    print("[PASS] Firebase create_user called correctly.")

    # Verify DB call
    mock_user_table.insert.assert_called_once()
    mock_insert.values.assert_called_once()
    
    call_args = mock_insert.values.call_args[1]
    print("DB Insert values:", call_args)
    
    if call_args["Email"] != "test@example.com":
        print("[FAIL] DB Email mismatch")
    if call_args["Name"] != "Test User":
        print("[FAIL] DB Name mismatch")
    if call_args["id"] != "test_firebase_uid":
        print("[FAIL] DB ID (UID) mismatch")
    
    if "Password" in call_args:
        print("[FAIL] Password SHOULD NOT be stored in DB!")
    else:
        print("[PASS] Password is NOT stored in DB.")
        
    print("Verification completed.")

if __name__ == "__main__":
    asyncio.run(run_verification())
