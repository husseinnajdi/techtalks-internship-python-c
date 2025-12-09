import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine
from databases import Database

DATABASE_URL = "postgresql+asyncpg://postgres:0710@localhost:5432/pythonCproject"

database = Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

User_table=sqlalchemy.Table(
    "Users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
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
    sqlalchemy.Column("AvgBudget", sqlalchemy.Integer),
    sqlalchemy.Column("PhoneNumber", sqlalchemy.Integer)
)

Favorite_table = sqlalchemy.Table(
    "Favorite",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("Activity_Id", sqlalchemy.ForeignKey("Activity.id"), nullable=False),
    sqlalchemy.Column("user_id", sqlalchemy.ForeignKey("users.id"), nullable=False)
)


Images_table = sqlalchemy.Table(
    "Images",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("Activity_Id", sqlalchemy.ForeignKey("Activity.id"), nullable=False),
    sqlalchemy.Column("IsMainImage", sqlalchemy.Boolean)
)

engine = create_async_engine(DATABASE_URL, echo=True)

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all)
