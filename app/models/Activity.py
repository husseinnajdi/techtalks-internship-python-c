from pydantic import BaseModel


class ActivityIn(BaseModel):
    phone_number: int
    Description: str
    AvgBudget:int
    type:str
    Location:str
    
class Activity(BaseModel):
    id:int
    ownerId:int
    class Config:
        orm_mode = True