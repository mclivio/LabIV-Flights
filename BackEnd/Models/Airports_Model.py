from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from pydantic import BaseModel
from sqlalchemy.orm import relationship


class AirportsDb(Base):
    __tablename__ = 'airports'

    id = Column(String(4), primary_key=True)
    name = Column(String(300), nullable = False)
    city = Column(String(120), nullable = False)
    country = Column(String(120), nullable = False)

class AirportsWithoutId(BaseModel):
    name: str
    city: str
    country: str
    

    class Config:
        orm_mode = True

class AirportsApi(AirportsWithoutId):
    id: str