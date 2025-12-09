from pydantic import BaseModel


class ImagesIn(BaseModel):
    IsMaiImage:bool


class Images(BaseModel):
    imageId:int
    activityId:int
    class config:
        orm_mode= True