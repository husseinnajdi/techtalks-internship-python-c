from pydantic import BaseModel
from typing import Optional
class ActivityIn(BaseModel):
    PhoneNumber: int
    Description: str
    AvgBudget: int
    Type: str
    Location: str
    OwnerId: int

class Image(BaseModel):
    id: str
    IsMainImage: bool

class Activity(ActivityIn):
    id: int

    class Config:
        orm_mode = True

class ActivityWithMainImage(Activity):
    main_image: Optional[Image]
