
import sys
import os
import asyncio
from app.main import app, lifespan

# Add root to path
sys.path.append(os.getcwd())

async def test_startup():
    print("Attempting to run lifespan...")
    try:
        async with lifespan(app):
            print("Startup successful!")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Startup failed: {e}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_startup())
