from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.sql.expression import and_
from starlette.exceptions import HTTPException
from Models.Flights_Model import FlightsDb
from Models.Planes_Model import PlanesDb
from Models.Tickets_Model import TicketsWithoutId, TicketsDb

class TicketsRepo():

    def get_all(self, session: Session):
        return session.execute(select(TicketsDb)).scalars().all()

    def get_by_flightId(self, flights_id: str, session: Session):
        t = session.execute(
            select(TicketsDb).where(TicketsDb.flights_id.ilike(flights_id))).scalars().all()         
        return t

    def get_by_Id(self, flights_id: str, seat_number: int, session: Session):
        t = session.execute(
            select(TicketsDb).where(TicketsDb.flights_id.ilike(flights_id), TicketsDb.seat_number == seat_number)).scalar()
        return t

    def get_by_passport(self, passport: str, session: Session):
        return session.execute(select(TicketsDb).where(TicketsDb.passport.contains(passport))).scalars().all()

    def post(self, data: TicketsDb, session: Session):
        pl = session.query(PlanesDb).filter(PlanesDb.id.ilike(FlightsDb.plane_id), FlightsDb.id.ilike(data.flights_id)).scalar()
        c = getattr(pl, 'capacity')
        if (c < data.seat_number):
            raise HTTPException(status_code=422, detail="Invalid data")
        tk = session.query(TicketsDb).filter(TicketsDb.flights_id.like(data.flights_id), TicketsDb.seat_number==data.seat_number).scalar()
        if tk is not None:
            return HTTPException(status_code=409, detail="Datos Duplicados")
        instance_db = TicketsDb(passport=data.passport, flights_id = data.flights_id, passenger_name = data.passenger_name, seat_number = data.seat_number)
        session.add(instance_db)
        session.commit()
        return instance_db

    def delete(self, flights_id:str, seat_number: int, session: Session):
        instance_db = session.get(TicketsDb, (flights_id, seat_number))
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not Found")
        try:
            session.delete(instance_db)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Delete")
        return True

    def put(self, flights_id: str, seat_number: int, data:TicketsWithoutId, session: Session):
        instance_db = session.get(TicketsDb, (flights_id, seat_number))
        if instance_db is None:
           raise HTTPException(status_code=404, detail="Not found")
        try:
            instance_db.passport= data.passport
            instance_db.passenger_name= data.passenger_name
            session.commit()
        except:
            raise HTTPException(status_code=400, detail="Can't Update")
        return instance_db
