from fastapi.exceptions import HTTPException
from fastapi import APIRouter, Depends
from pydantic.types import T
from sqlalchemy.orm import Session
from db import get_session
from Repositories.Tickets_Repo import TicketsRepo
from Models.Tickets_Model import TicketsWithoutId, TicketsApi
from typing import List

tickets_router = APIRouter(prefix='/tickets', tags=['tickets'])
repo = TicketsRepo()

@tickets_router.get('/')
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@tickets_router.get('/{flights_id}/{seat_number}')
def get_by_Id(flights_id: str, seat_number: int, s: Session = Depends(get_session)):
    t = repo.get_by_Id(flights_id, seat_number,s)
    if t is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return t

#returns ticket for a specified flight
@tickets_router.get('/{flights_id}')
def get_by_flightId(flights_id: str, s: Session = Depends(get_session)):
    t = repo.get_by_flightId(flights_id,s)
    if t is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return t

@tickets_router.get('/flights_id/seat_number/{passport}')
def get_by_passport(passport:str, s:Session = Depends(get_session)):
    t = repo.get_by_passport(passport,s)
    if t is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return t

@tickets_router.post('/', response_model= TicketsApi)
def post(data: TicketsApi, s: Session = Depends(get_session)):
    t=repo.post(data, s)
    return t

@tickets_router.delete('/{flights_id}/{seat_number}')
def delete(flights_id: str, seat_number: int, s:Session = Depends(get_session)):
    repo.delete(flights_id, seat_number, s)
    return "Deleted"

@tickets_router.put('/{flights_id}/{seat_number}', response_model=TicketsApi)
def put(flights_id: str, seat_number: int, data: TicketsWithoutId, s:Session = Depends(get_session)):
    t = repo.put(flights_id, seat_number, data, s)
    return t