from pydantic import BaseModel, Field
from typing import Optional
class ActivityIn(BaseModel):
    PhoneNumber: int
    Description: str
    AvgBudget: int
    Type: str
    Location: str
    Latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    Longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    OwnerId: str

class Image(BaseModel):
    id: str
    IsMainImage: bool

class Activity(ActivityIn):
    id: int

    class Config:
        from_attributes = True

class ActivityWithMainImage(Activity):
    main_image: Optional[Image]

class ActivityWithMainImageDistance(ActivityWithMainImage):
    distance_km: float