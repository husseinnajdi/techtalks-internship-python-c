from pydantic import BaseModel


class ImagesIn(BaseModel):
    IsMainImage:bool
    id:str
class AddImageIn(BaseModel):
    Activity_Id: int
    id: str
    IsMainImage: bool
    


class Images(BaseModel):
    Activity_Id:int
    class Config:
        from_attributes = True