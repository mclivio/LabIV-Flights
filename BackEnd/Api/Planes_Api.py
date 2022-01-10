from fastapi.exceptions import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_session
from Repositories.Planes_Repo import PlanesRepo
from Models.Planes_Model import PlanesWithoutId, PlanesApi
from typing import List

planes_router = APIRouter(prefix='/planes', tags=['Planes'])
repo = PlanesRepo()

@planes_router.get('/')
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@planes_router.get('/{id}')
def get_by_id(id: str, s: Session = Depends(get_session)):
    p = repo.get_by_id(id,s)
    if p is None:
        raise HTTPException(status_code=404, detail="Not Found")
    return p

#searches by brand
@planes_router.get('/search/{brand}')
def get_by_brand(brand:str, s:Session = Depends(get_session)):
    return repo.get_by_brand(brand, s)

@planes_router.post('/', response_model= PlanesApi)
def post(data: PlanesApi, s: Session = Depends(get_session)):
    p=repo.post(data, s)
    return p

@planes_router.delete('/{id}')
def delete(id: str, s:Session = Depends(get_session)):
    repo.delete(id, s)
    return "Deleted"

@planes_router.put('/{id}', response_model=PlanesApi)
def put(id: str, data: PlanesWithoutId, s:Session = Depends(get_session)):
    p = repo.put(id, data, s)
    return p