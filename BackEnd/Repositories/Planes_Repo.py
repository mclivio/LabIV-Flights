from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from starlette.exceptions import HTTPException
from Models.Planes_Model import PlanesWithoutId, PlanesDb

class PlanesRepo():

    def get_all(self, session: Session):
        return session.execute(select(PlanesDb)).scalars().all()

    def get_by_id(self, id: str, session: Session):
        p = session.execute(
            select(PlanesDb).where(PlanesDb.id == id)).scalar()         
        return p
    
    def get_by_brand(self, brand: str, session: Session):
        return session.execute(select(PlanesDb).where(or_(PlanesDb.brand.ilike(f'%{brand}%'),PlanesDb.model.ilike(f'%{brand}%')))).scalars().all()

    def post(self, data: PlanesDb, session: Session):
        instance_db = PlanesDb(id=data.id, brand = data.brand, model = data.model, capacity = data.capacity)
        session.add(instance_db)
        session.commit()
        return instance_db

    def delete(self, id:str, session: Session):
        instance_db = session.get(PlanesDb, id)
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not Found")
        try:
            session.delete(instance_db)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Delete")
        return True
    
    def put(self, id: str, data: PlanesWithoutId, session: Session):
        instance_db = session.get(PlanesDb, id)
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not found")
        try:
            instance_db.brand= data.brand
            instance_db.model= data.model
            instance_db.capacity= data.capacity
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Update")
        return instance_db