from pydantic import BaseModel
from datetime import date

class ApplicationIn(BaseModel):
    Email:str
    name:str
    
class Application(BaseModel):
    id:str
    class Config:
        from_attributes = True