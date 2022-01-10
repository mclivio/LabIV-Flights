from fastapi.exceptions import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_session
from Repositories.Airports_Repo import AirportsRepo
from Models.Airports_Model import AirportsWithoutId, AirportsApi
from typing import List

airports_router = APIRouter(prefix='/airports', tags=['Airports'])
repo = AirportsRepo()

@airports_router.get('/')
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@airports_router.get('/{id}')
def get_by_id(id: str, s: Session = Depends(get_session)):
    a = repo.get_by_id(id,s)
    if a is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return a

#searches by airport's name
@airports_router.get('/search/{name}')
def get_by_name(name:str, s:Session = Depends(get_session)):
    return repo.get_by_name(name, s)

@airports_router.post('/', response_model= AirportsApi)
def post(data: AirportsApi, s: Session = Depends(get_session)):
    a=repo.post(data, s)
    return a

@airports_router.delete('/{id}')
def delete(id: str, s:Session = Depends(get_session)):
    repo.delete(id, s)
    return "Deleted"

@airports_router.put('/{id}', response_model=AirportsApi)
def put(id: str, data: AirportsWithoutId, s:Session = Depends(get_session)):
    a = repo.put(id, data, s)
    return a