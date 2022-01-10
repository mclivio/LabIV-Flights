from sqlalchemy.orm import Session
from sqlalchemy import select
from starlette.exceptions import HTTPException
from Models.Airports_Model import AirportsWithoutId, AirportsDb

class AirportsRepo():

    def get_all(self, session: Session):
        return session.execute(select(AirportsDb)).scalars().all()

    def get_by_id(self, id: str, session: Session):
        a = session.execute(
            select(AirportsDb).where(AirportsDb.id == id)).scalar()         
        return a
    
    def get_by_name(self, name: str, session: Session):
        return session.execute(select(AirportsDb).where(AirportsDb.name.ilike(f'%{name}%'))).scalars().all()

    def post(self, data: AirportsDb, session: Session):
        instance_db = AirportsDb(id=data.id, name = data.name, city = data.city, country = data.country)
        session.add(instance_db)
        session.commit()
        return instance_db

    def delete(self, id:str, session: Session):
        instance_db = session.get(AirportsDb, id)
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not Found")
        try:
            session.delete(instance_db)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Delete")
        return True
    
    def put(self, id: str, data: AirportsWithoutId, session: Session):
        instance_db = session.get(AirportsDb, id)
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not found")
        try:
            instance_db.name= data.name
            instance_db.city= data.city
            instance_db.country= data.country
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Update")
        return instance_db