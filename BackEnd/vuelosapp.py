from fastapi import FastAPI
import uvicorn
import db
from Api.Airports_Api import airports_router
from Api.Planes_Api import planes_router
from Api.Tickets_Api import tickets_router
from Api.Flights_Api import flights_router
from Models.Airports_Model import AirportsDb
from Models.Planes_Model import PlanesDb
from Models.Flights_Model import FlightsDb
from Models.Tickets_Model import TicketsDb
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(airports_router)
app.include_router(planes_router)
app.include_router(flights_router)
app.include_router(tickets_router)


#db.drop_all()
db.create_all()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__=='__main__':
    uvicorn.run("vuelosapp:app", reload=True)