from datetime import date, time
from sqlalchemy import select, func
from sqlalchemy import Column, String, ForeignKey, Date, Time, Integer
from pydantic import BaseModel
from sqlalchemy.orm import relationship
from Models.Planes_Model import PlanesDb
from db import Base

class FlightsDb(Base):
    __tablename__ = 'flights'

    id = Column(String(5), primary_key=True)
    flight_date = Column(Date, nullable = False)
    flight_hour = Column(Time, nullable = False)
    origin_id = Column(ForeignKey('airports.id'), nullable = False)
    destination_id = Column(ForeignKey('airports.id'), nullable = False)
    plane_id = Column(ForeignKey('planes.id'), nullable = False)

    origin=relationship('AirportsDb', foreign_keys=[origin_id], lazy='joined')
    destination=relationship('AirportsDb', foreign_keys=[destination_id], lazy='joined')
    plane=relationship('PlanesDb', lazy='joined')
    
class FlightsWithoutId(BaseModel):
    flight_date: date
    flight_hour: time
    origin_id: str
    destination_id: str
    plane_id: str
    
    class Config:
        orm_mode = True

class FlightsApi(FlightsWithoutId):
    id: str