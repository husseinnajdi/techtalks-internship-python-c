from pydantic import BaseModel

class FavoriteIn(BaseModel):
    Activity_Id:int
    user_id:int
class Favorite(BaseModel):
    id: int
    user_id: int
    Activity_Id: int

    class Config:
        orm_mode = True
