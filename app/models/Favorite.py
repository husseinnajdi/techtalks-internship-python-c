from pydantic import BaseModel

class FavoriteIn(BaseModel):
    ActivityId:int

class Favorite(BaseModel):
    id:int
    UserId:int
    class config:
        orm_mode= True