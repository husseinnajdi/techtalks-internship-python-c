from fastapi import APIRouter, HTTPException, requests,Depends
from models.Applications import Application,ApplicationIn
from database import database, Application_table
from app.firebase_config import *
router=APIRouter()

async def get_apply_by_id(int:id):
    query=Application_table.select().where(Application_table.c.id==id)
    record=await database.fetch_one(query)
    return record

@router.post("/apply",response_model=Application)
async def make_application(application:ApplicationIn):
    data={**application.dict()}
    query=Application_table.insert().values(data)
    last_record_id=await database.execute(query)
    return {**data, "id": last_record_id}


@router.get("/applications",response_model=Application)
async def get_all_apply():
    query=Application_table.select().where(Application_table.c.Status == "pending")
    return await database.fetch_all(query)

@router.delete("/deletapply/{id}",response_model=Application)
async def delet_application(int:id):
    if not get_apply_by_id(id):
        raise HTTPException(status_code=404,detail="Application Not Found")
    query=Application_table.delete().where(Application_table.c.id== id)
    await database.execute(query)
    return {"message": "Application deleted seccessfully","application id":id}

@router.post("/approveapply/{id}",response_model=Application)
async def approve_application(int: id):
    query=Application_table.select().where(Application_table.c.id== id)
    application=database.execute(query)
    if not application:
        raise HTTPException(status_code=404,detail="no application founded")
    email=application["Email"]
    name=application["Name"]
    try:
        user=auth.create_user(
            email=email,
            password=name + "123"
        )
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
    
    update_query = (
        Application_table.update()
        .where(Application_table.c.id == id)
        .values(Status="approved")
    )
    await database.execute(update_query)

    return {"uid":user.uid,"email":email}



