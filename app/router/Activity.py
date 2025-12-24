from fastapi import APIRouter, HTTPException, Depends
from app.models.Activity import Activity, ActivityIn,ActivityWithMainImage
from app.models.images import Images, ImagesIn, AddImageIn
from app.database import database, Activity_table, Images_table, User_table
from app.firebase_config import auth
from app.router.auth import get_current_user

router = APIRouter()

async def get_image_by_activityId(activity_id: int):
    query = Images_table.select().where(Images_table.c.Activity_Id == activity_id)
    return await database.fetch_all(query)

@router.post("/activity",response_model=Activity)
async def create_new_activity(activity: ActivityIn, img:ImagesIn, current_user: dict = Depends(get_current_user)):
    # Override OwnerId with the authenticated user's UID
    data={**activity.dict(), "OwnerId": current_user['uid']}
    imagedata={**img.dict()}
    
    query=Activity_table.insert().values(data)
    last_record_id=await database.execute(query)
    
    imgquery=Images_table.insert().values({**imagedata,"Activity_Id":last_record_id})
    await database.execute(imgquery)
    
    return {**data,"id": last_record_id}

@router.post("/activity/image",response_model=Images)
async def add_image_to_activity(img:AddImageIn, current_user: dict = Depends(get_current_user)):
    # In a real app, verify that current_user owns the activity relevant to this image
    imagedata={**img.dict()}
    imgquery=Images_table.insert().values(imagedata)
    last_record_id=await database.execute(imgquery)
    return {**imagedata,"id": last_record_id}

@router.put("/activity/{activity_id}",response_model=Activity)
async def update_activity(activity_id: int, activity: ActivityIn, current_user: dict = Depends(get_current_user)):
    # Verify ownership
    query_check = Activity_table.select().where(Activity_table.c.id == activity_id)
    existing_activity = await database.fetch_one(query_check)
    
    if not existing_activity:
         raise HTTPException(status_code=404, detail="Activity not found")
         
    if existing_activity['OwnerId'] != current_user['uid']:
        raise HTTPException(status_code=403, detail="Not authorized to update this activity")

    data={**activity.dict(), "OwnerId": current_user['uid']}
    query=Activity_table.update().where(Activity_table.c.id==activity_id).values(data)
    await database.execute(query)
    return {**data,"id": activity_id}

@router.put("/activity/image/{img_id}",response_model=Images)
async def update_main_image(img_id: str, img: ImagesIn, current_user: dict = Depends(get_current_user)):
    # Should check ownership of the activity the image belongs to
    imagedata={**img.dict()}
    query=Images_table.update().where(Images_table.c.id==img_id).values(imagedata)
    await database.execute(query)
    return {**imagedata,"id": img_id}

@router.delete("/activity/{img_id}")
async def delete_image_from_activity(img_id: str, current_user: dict = Depends(get_current_user)):
    # Should check ownership
    query=Images_table.delete().where(Images_table.c.id==img_id)
    await database.execute(query)
    return {"message":"Image deleted successfully"}

@router.get("/activity/{activity_id}",response_model=Activity)
async def get_activity_by_id(activity_id: int):
    query=Activity_table.select().where(Activity_table.c.id==activity_id)
    activity=await database.fetch_one(query)
    if not  activity:
        raise HTTPException(status_code=404,detail="Activity not found")
    return activity



@router.get("/activitys", response_model=list[ActivityWithMainImage])
async def get_all_activitys():
    query = (
        Activity_table
        .outerjoin(
            Images_table,
            (Images_table.c.Activity_Id == Activity_table.c.id) &
            (Images_table.c.IsMainImage == True)
        )
        .select()
    )

    rows = await database.fetch_all(query)

    result = []
    for row in rows:
        activity = dict(row)

        main_image = None
        if row["id_1"]: 
            main_image = {
                "id": row["id_1"],
                "IsMainImage": row["IsMainImage"]
            }

        activity["main_image"] = main_image
        result.append(activity)

    return result


@router.get("/activitybyid/{activity_id}", response_model=Activity)
async def get_activity_by_id(activity_id: int):
    query=Activity_table.select().where(Activity_table.c.id==activity_id)
    activity=await database.fetch_one(query)