from fastapi import APIRouter, HTTPException
from models.Favorite import Favorite, FavoriteIn
from database import database, Favorite_table

router=APIRouter()

@router.post("/favorite",response_model=Favorite)
async def add_to_favorite(favorite:FavoriteIn):
    data={**favorite.dict()}
    query=Favorite_table.insert().values(data)
    last_record_id=await database.execute(query)
    return {**data,"id":last_record_id}

@router.get("/favorites/{user_id}", response_model=list[Favorite])
async def get_favorites_by_user(user_id: int):
    query = Favorite_table.select().where(Favorite_table.c.user_id == user_id)
    return await database.fetch_all(query)


@router.delete("/favorite/{id}")
async def remove_from_favorite(id:int):
    query=Favorite_table.delete().where(Favorite_table.c.id==id)
    await database.execute(query)
    return {"message":"Favorite removed successfully","favorite_id":id}