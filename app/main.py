from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.router.Application import router as apply_router
from app.database import database, init_models
from app.router.Activity import router as activity_router
from app.router.favorite import router as favorite_router
from app.router.auth import router as auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    await init_models()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)
app.include_router(activity_router)
app.include_router(apply_router)
app.include_router(favorite_router)
app.include_router(auth_router)
