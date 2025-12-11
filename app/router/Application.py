from fastapi import APIRouter, HTTPException
from models.Applications import Application, ApplicationIn
from database import database, Application_table
from firebase_config import auth

router = APIRouter()


async def get_apply_by_id(id: int):
    query = Application_table.select().where(Application_table.c.id == id)
    return await database.fetch_one(query)


@router.post("/apply", response_model=Application)
async def make_application(application: ApplicationIn):
    data = {**application.dict()}
    query = Application_table.insert().values(data)
    last_record_id = await database.execute(query)
    return {**data, "id": last_record_id}


@router.get("/applications", response_model=list[Application])
async def get_all_apply():
    query = Application_table.select().where(Application_table.c.Status == "pending")
    return await database.fetch_all(query)


@router.delete("/deleteapply/{id}")
async def delete_application(id: int):
    record = await get_apply_by_id(id)
    if not record:
        raise HTTPException(status_code=404, detail="Application not found")

    query = Application_table.delete().where(Application_table.c.id == id)
    await database.execute(query)

    return {"message": "Application deleted successfully", "application_id": id}


@router.post("/approveapply/{id}")
async def approve_application(id: int):
    query = Application_table.select().where(Application_table.c.id == id)
    application = await database.fetch_one(query)

    if not application:
        raise HTTPException(status_code=404, detail="No application found")

    email = application["Email"]
    name = application["Name"] 

    try:
        user = auth.create_user(
            email=email,
            password=name + "123"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    update_query = (
        Application_table.update()
        .where(Application_table.c.id == id)
        .values(Status="approved")
    )
    await database.execute(update_query)

    return {"uid": user.uid, "email": email}
