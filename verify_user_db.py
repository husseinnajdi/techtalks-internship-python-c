import asyncio
from app.database import database, User_table, init_models
from app.firebase_config import auth
from sqlalchemy import select

async def main():
    try:
        await database.connect()
        # Ensure models are initialized (create tables if not exist)
        await init_models()
        
        query = select(User_table)
        results = await database.fetch_all(query)
        print(f"Total Users in DB: {len(results)}")
        for row in results:
            print(f"DB User: {dict(row)}")
            # Check Firebase
            try:
                fb_user = auth.get_user(row['id'])
                print(f"  -> Firebase User Found: Email={fb_user.email}, UID={fb_user.uid}")
            except Exception as e:
                print(f"  -> Firebase User MISSING! Error: {e}")
                
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await database.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
