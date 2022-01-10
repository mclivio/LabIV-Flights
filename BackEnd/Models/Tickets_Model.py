from sqlalchemy.sql.expression import select
from sqlalchemy.sql.sqltypes import Integer
from db import Base
from sqlalchemy import Column, String, ForeignKey
from pydantic import BaseModel
from sqlalchemy.orm import relationship
from Models.Planes_Model import PlanesDb

class TicketsDb(Base):
    __tablename__ = 'tickets'

    passport = Column(String(60))
    flights_id = Column(ForeignKey('flights.id'), primary_key= True)
    passenger_name = Column(String(120), nullable = False)
    seat_number = Column(Integer, primary_key= True)

    flights=relationship('FlightsDb', lazy='joined')
    
class TicketsWithoutId(BaseModel):
    passport: str
    passenger_name: str
    
    class Config:
        orm_mode = True
        
class TicketsApi(TicketsWithoutId):
    flights_id: str
    seat_number: int
