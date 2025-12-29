import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine
from databases import Database
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = "postgresql+asyncpg://postgres:0710@localhost:5432/pythonCproject"

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

database = Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

User_table=sqlalchemy.Table(
    "Users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("Email", sqlalchemy.String),
    sqlalchemy.Column("Name", sqlalchemy.String),
    sqlalchemy.Column("Password", sqlalchemy.String),
    sqlalchemy.Column("role",sqlalchemy.String)
)

Application_table = sqlalchemy.Table(
    "Application",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("Email", sqlalchemy.String),
    sqlalchemy.Column("Name", sqlalchemy.String),
    sqlalchemy.Column("Status", sqlalchemy.String),
    sqlalchemy.Column("Message", sqlalchemy.String),
    sqlalchemy.Column("Date_Of_Apply", sqlalchemy.DATE)
)

Activity_table = sqlalchemy.Table(
    "Activity",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("Description", sqlalchemy.String),
    sqlalchemy.Column("Type", sqlalchemy.String),
    sqlalchemy.Column("Location", sqlalchemy.String),
    # Geo coordinates (WGS84). Keeping Location as a human-readable string,
    # and storing the actual point separately for proper distance queries.
    sqlalchemy.Column("Latitude", sqlalchemy.Float, nullable=True),
    sqlalchemy.Column("Longitude", sqlalchemy.Float, nullable=True),
    sqlalchemy.Column("AvgBudget", sqlalchemy.Integer),
    sqlalchemy.Column("PhoneNumber", sqlalchemy.BigInteger),
    sqlalchemy.Column("OwnerId",sqlalchemy.ForeignKey("Users.id"),nullable=False)
)
sqlalchemy.Index("ix_activity_latitude_longitude", Activity_table.c.Latitude, Activity_table.c.Longitude)

Favorite_table = sqlalchemy.Table(
    "Favorite",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("Activity_Id", sqlalchemy.ForeignKey("Activity.id"), nullable=False),
    sqlalchemy.Column("user_id", sqlalchemy.ForeignKey("Users.id"), nullable=False)
)


Images_table = sqlalchemy.Table(
    "Images",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("Activity_Id", sqlalchemy.ForeignKey("Activity.id"), nullable=False),
    sqlalchemy.Column("IsMainImage", sqlalchemy.Boolean)
)

engine = create_async_engine(DATABASE_URL, echo=True)

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all)
