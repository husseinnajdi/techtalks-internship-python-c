from pydantic import BaseModel
from datetime import date

class ApplicationIn(BaseModel):
    Email:str
    Message:str
    Name:str
    status:str
    DateOfApply: date
    
class Application(BaseModel):
    id:int
    class config:
        orm_mode = True