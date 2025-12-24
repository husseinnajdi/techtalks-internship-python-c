from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.firebase_config import auth
from app.database import database, User_table
from pydantic import BaseModel

router = APIRouter()
security = HTTPBearer()

# Signup Model - Password is used only to create user in Firebase, not stored locally
class UserSignup(BaseModel):
    email: str
    password: str
    name: str

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the Firebase ID Token and returns the decoded token (user info).
    """
    token = credentials.credentials
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(token)
        # Check if user exists in local DB? Optional, but good practice for role syncing.
        # For now, we trust the token.
        return decoded_token
    except Exception as e:
        print(f"Auth error: {e}") 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/auth/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup):
    try:
        # 1. Create user in Firebase using Admin SDK
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name
        )
        
        # 2. Store user profile in local DB (WITHOUT PASSWORD)
        # Using the Firebase UID as the primary key
        query = User_table.insert().values(
            id=user_record.uid,
            Email=user.email,
            Name=user.name,
            role="user" # Default role
        )
        await database.execute(query)
        
        return {"uid": user_record.uid, "message": "User created successfully"}
        
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists in Firebase"
        )
    except Exception as e:
        # If DB insert fails, we should ideally rollback Firebase user creation.
        # But for MVP/internship task, this is acceptable with logging.
        print(f"Signup error: {e}")
        try:
           if 'user_record' in locals():
               auth.delete_user(user_record.uid)
        except:
           pass
           
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

@router.get("/auth/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "uid": current_user.get("uid"),
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "picture": current_user.get("picture"),
    }

