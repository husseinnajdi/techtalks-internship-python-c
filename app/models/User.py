from pydantic import BaseModel
from datetime import date

class ApplicationIn(BaseModel):
    Email:str
    name:str
    password:str
    
class Application(BaseModel):
    id:int
    class config:
        orm_mode = True