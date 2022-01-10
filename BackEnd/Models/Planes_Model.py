from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from pydantic import BaseModel
from sqlalchemy.orm import relationship

class PlanesDb(Base):
    __tablename__ = 'planes'

    id = Column(String(3), primary_key=True)
    brand = Column(String(120), nullable = False)
    model = Column(String(300), nullable = True)
    capacity=Column(Integer, nullable=False)
  
class PlanesWithoutId(BaseModel):
    brand: str
    model: str
    capacity: int
    
    class Config:
        orm_mode = True

class PlanesApi(PlanesWithoutId):
    id: str