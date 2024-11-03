# Modelos de dados (SQLAlchemy)
from sqlalchemy import Column, Integer, String
from .database import Base

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    contact_info = Column(String)
