
import sys
import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

# Add root to path
sys.path.append(os.getcwd())

# We need to manually parse the DB URL because we can't easily import app.database 
# if the app startup has side effects (like connecting immediately) or if we want to isolate the test.
# But actually, app.database instantiation is safe.
try:
    from app.database import DATABASE_URL
    print(f"Testing connection to: {DATABASE_URL}")
except ImportError:
    print("Could not import DATABASE_URL from app.database")
    # Fallback to the one we saw in the file
    DATABASE_URL = "postgresql+asyncpg://postgres:0710@localhost:5432/pythonCproject"

async def test_connection():
    try:
        engine = create_async_engine(DATABASE_URL)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"Connection Successful! Result: {result.scalar()}")
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_connection())
