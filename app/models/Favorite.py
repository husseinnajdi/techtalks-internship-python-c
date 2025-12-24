from pydantic import BaseModel

class FavoriteIn(BaseModel):
    Activity_Id:int
    user_id:str

class Favorite(BaseModel):
    id: int
    user_id: str
    Activity_Id: int

    class Config:
        from_attributes = True
