import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FaRegEdit, FaTrashAlt, FaSearch} from "react-icons/fa";

const TicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [flights, setFlights] = useState([]);
  const [searchFlight, setSearchFlight] =useState('');
  
  const resetInputFlight = () => {
    setSearchFlight("");
  };

  const getFlights = () => {
    axios.get('http://localhost:8000/flights')
      .then(response => setFlights(response.data))
      .catch(error => alert(error))
  }

  const getTicketsByFlightsID = () => {
    
    if(searchFlight==='Elegir Vuelo'||searchFlight===''){
      axios.get(`http://localhost:8000/tickets`)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => alert(error))
    }
    else{
      axios.get(`http://localhost:8000/tickets/${searchFlight}`)
      .then(response => setTickets(response.data))
      .catch(error=> alert(error))

    }
  }

  const getTickets = () => {
    if(search === '')
    {
      axios.get(`http://localhost:8000/tickets`)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => alert(error))
    }
    else
    {
      axios.get(`http://localhost:8000/tickets/flights_id/seat_number/${search}`)
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => alert(error))
    }
  }

  const deleteTicket = (flights_id, seat_number) => {
    axios.delete(`http://localhost:8000/tickets/${flights_id}/${seat_number}`)
      .then(() => {
        alert('Pasaje eliminado');
        getTickets();
      })
      .catch(error => alert(error))
  }

  const MostrarTodo = () =>{
    axios.get('http://localhost:8000/tickets')
      .then(response => setTickets(response.data))
      .catch(error => alert(error))
  }
  useEffect(() => {
    getFlights();
  }, [])

  useEffect(() => {
    getTickets();
  }, []);

  const changeSearch = (newSearch) =>{
    setSearch(newSearch);
  }

  const keyPressed = (keyEvent) => {
    if(keyEvent.charCode === 13) {
      getTickets()
    }
  }
  return (
    <div>
      <div className="row align-items-start">
        {/* <div className="col-9">
          <input
            placeholder="Buscar por pasaporte..."
            className="form-control"
            name="search"
            value={search}
            onKeyPress={keyPressed}
            onChange={(e) => changeSearch(e.target.value)}
          />
        </div>
        <div className="col-1">
          <button className="btn btn-primary" onClick={getTickets}>
            <FaSearch />
          </button>
        </div> */}
        <div className="col-9">
          <select
            name="searchFlight"
            className="form-select"
            onChange={(e) =>
              setSearchFlight(e.target.options[e.target.selectedIndex].value)
            }
            value={searchFlight}
          >
            <option selected>Elegir Vuelo</option>
            {flights.map((flight) => (
              <option value={flight.id}>{flight.id}</option>
            ))}
          </select>
        </div>
        <div className="col-1">
          <button className="btn btn-primary" onClick={getTicketsByFlightsID}>
            <FaSearch />
          </button>
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={resetInputFlight}>
            Limpiar
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">CODIGO DE VUELO</th>
                <th scope="col">PASAPORTE - PASAJERO</th>
                <th scope="col">NOMBRE - PASAJERO</th>
                <th scope="col">NUMERO DE ASIENTO</th>
                <th scope="col">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                // revisar key, es passport + seatNumber o ID? El json no tiene una ID autogenerada que se pueda usar en vez de la pk compuesta de la bd?
                <tr key={(ticket.flights_id, ticket.seat_number)}>
                  <td>{ticket.flights_id}</td>
                  <td>
                    <Link
                      to={`ticket/${ticket.flights_id}/${ticket.seat_number}`}
                    >
                      {ticket.passport}
                    </Link>
                  </td>
                  <td>{ticket.passenger_name}</td>
                  <td>{ticket.seat_number}</td>
                  <td>
                    <button
                      onClick={() =>
                        deleteTicket(ticket.flights_id, ticket.seat_number)
                      }
                      className="btn btn-danger"
                      data-toggle="tooltip"
                      title="Eliminar"
                    >
                      <FaTrashAlt />
                    </button>
                    <Link
                      to={`ticket/${ticket.flights_id}/${ticket.seat_number}`}
                      className="btn btn-warning ml-2 text-white"
                      data-toggle="tooltip"
                      title="Editar"
                      style={{ marginLeft: 5 }}
                    >
                      <FaRegEdit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="container">
      <div class="row justify-content-between">
      <div className="col-2">
        <Link to="ticket/new">
          <button className="btn btn-warning text-white">Nuevo Pasaje</button>
        </Link>
      </div>
      <div className="col-2">
      <button className="btn btn-success text-white" onClick={MostrarTodo}>Mostrar Todo</button>
    </div>
    </div>
    </div>
    </div>
  );
};

export default TicketsList;