from fastapi.exceptions import HTTPException
from fastapi import APIRouter, Depends
from pydantic.types import T
from sqlalchemy.orm import Session
from db import get_session
from Repositories.Flights_Repo import FlightsRepo
from Models.Flights_Model import FlightsWithoutId, FlightsApi
from typing import List
import datetime

flights_router = APIRouter(prefix='/flights', tags=['flights'])
repo = FlightsRepo()

@flights_router.get('/')
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@flights_router.get('/{id}')
def get_by_id(id: str, s: Session = Depends(get_session)):
    f = repo.get_by_id(id,s)
    if f is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return f

#searches by origin and filters by a range of dates
@flights_router.get('/search/{origin_id}/{date_from}/{date_to}')
def get_by_airport_dates(origin_id:str, date_from: datetime.date, date_to: datetime.date, s:Session = Depends(get_session)):
    return repo.get_by_airport_dates(origin_id, date_from, date_to, s)

@flights_router.get('/search/{origin_id}')
def get_by_airport(origin_id:str, s:Session = Depends(get_session)):
    return repo.get_by_airport(origin_id, s)

#returns the amount of available seats for a specified flight
@flights_router.get('/{id}/availables')
def get_avaiables(id:str, s: Session = Depends(get_session)):
    return repo.get_availables(id,s)

@flights_router.post('/', response_model= FlightsApi)
def post(data: FlightsApi, s: Session = Depends(get_session)):
    t=repo.post(data, s)
    return t

@flights_router.delete('/{id}')
def delete(id: str, s:Session = Depends(get_session)):
    repo.delete(id, s)
    return "Deleted"

@flights_router.put('/{id}', response_model=FlightsApi)
def put(id: str, data: FlightsWithoutId, s:Session = Depends(get_session)):
    t = repo.put(id, data, s)
    return t