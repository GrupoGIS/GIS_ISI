# Schemas de validação (Pydantic)
from pydantic import BaseModel

class ClientBase(BaseModel):
    name: str
    address: str
    contact_info: str

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    
    class Config:
        orm_mode = True
