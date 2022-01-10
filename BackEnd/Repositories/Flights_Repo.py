from datetime import datetime
from operator import or_, and_
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql.sqltypes import Integer
from starlette.exceptions import HTTPException
from Models.Tickets_Model import TicketsDb
from Models.Flights_Model import FlightsWithoutId, FlightsDb
from Models.Planes_Model import PlanesDb

class FlightsRepo():

    def get_all(self, session: Session):
        return session.execute(select(FlightsDb)).scalars().all()

    def get_by_id(self, id: str, session: Session):
        t = session.execute(
            select(FlightsDb).where(FlightsDb.id == id )).scalar()         
        return t
    
    def get_by_airport_dates(self, origin_id: str, date_from: datetime.date, date_to: datetime.date, session: Session):
        return session.execute(select(FlightsDb).where(FlightsDb.origin_id.ilike(f'%{origin_id}%')).where(FlightsDb.flight_date>=date_from).where(FlightsDb.flight_date<=date_to)).scalars().all()

    def get_by_airport(self, origin_id: str, session: Session):
        return session.execute(select(FlightsDb).where(FlightsDb.origin_id.ilike(f'%{origin_id}%'))).scalars().all()

    def get_availables(self, id: str, session: Session):
        amount = session.query(TicketsDb).where(TicketsDb.flights_id.ilike(id)).count()
        plane = session.execute(select(PlanesDb).where(PlanesDb.id.ilike(FlightsDb.plane_id)).where(FlightsDb.id.ilike(id))).scalar()
        capacity = getattr(plane, 'capacity')
        if (amount > 0):
            return (capacity - amount)
        else:
            return capacity

    def post(self, data: FlightsDb, session: Session):
        instance_db = FlightsDb(id=data.id, flight_date = data.flight_date, flight_hour= data.flight_hour, origin_id = data.origin_id, destination_id = data.destination_id, plane_id=data.plane_id)
        session.add(instance_db)
        session.commit()
        return instance_db

    def delete(self, id:str, session: Session):
        instance_db = session.get(FlightsDb, id)
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not Found")
        try:
            session.delete(instance_db)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Delete")
        return True
    
    def put(self, id: str, data: FlightsWithoutId, session: Session):
        instance_db = session.get(FlightsDb, id)
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not found")
        try:
            instance_db.flight_date= data.flight_date
            instance_db.flight_hour = data.flight_hour
            instance_db.origin_id= data.origin_id
            instance_db.destination_id= data.destination_id
            instance_db.plane_id=data.plane_id
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Update")
        return instance_db