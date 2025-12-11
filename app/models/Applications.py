from pydantic import BaseModel
from datetime import date

class ApplicationIn(BaseModel):
    Email: str
    Message: str
    Name: str
    Status: str
    Date_Of_Apply: date


class Application(ApplicationIn):
    id: int

    class Config:
        orm_mode = True
