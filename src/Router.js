import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import AirportsList from "./components/airports/AirportsList";
import AirportForm from "./components/airports/AirportForm";
import PlanesList from "./components/planes/PlanesList";
import PlaneForm from "./components/planes/PlaneForm";
import FlightsList from "./components/flights/FlightsList";
import FlightForm from "./components/flights/FlightForm";
import TicketsList from "./components/tickets/TicketsList";
import TicketForm from "./components/tickets/TicketForm";

const RouterComponent = () => {
    return (
        <BrowserRouter>
            <div className="container">
                <div className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <ul className="navbar-nav m-auto">
                        <li className="nav-item">
                            <Link to="/airports" style={{textDecoration: 'none', marginRight: 5, marginLeft:5}} className='text-light'>
                                Aeropuertos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/planes" style={{ textDecoration: 'none', marginRight: 5, marginLeft:5}} className='text-light'>
                                Aviones
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/flights" style={{ textDecoration: 'none', marginRight: 5, marginLeft:5}} className='text-light'>
                                Vuelos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/tickets" style={{ textDecoration: 'none', marginRight: 5, marginLeft:5}} className='text-light'>
                                Pasajes
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* replace Switch for Routes when using a newer version of react-router-dom */}
                <Switch>
                    <Route path="/airports" component={AirportsList}/>
                    <Route path="/planes" component={PlanesList}/>
                    <Route path="/flights" component={FlightsList}/>
                    <Route path="/tickets" component={TicketsList}/>
                    <Route path="/airport/new" component={AirportForm} exact />
                    <Route path="/airport/:idAirport" component={AirportForm}/>
                    <Route path="/plane/new" component={PlaneForm} exact/>
                    <Route path="/plane/:idPlane" component={PlaneForm}/>
                    <Route path="/flight/new" component={FlightForm} exact/>
                    <Route path="/flight/:idFlight" component={FlightForm} />
                    <Route path="/ticket/new" component={TicketForm} exact/>
                    <Route path="/ticket/:flights_id/:seat_number" component={TicketForm} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export default RouterComponent;