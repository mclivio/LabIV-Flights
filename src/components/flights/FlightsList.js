import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FaRegEdit, FaTrashAlt, FaSearch} from "react-icons/fa";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

const FlightsList = () => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [search, setSearch] = useState({
    origin_id: '',
    date_from: new Date().toString,
    date_to: new Date().toString
  });

  const [info, setInfo] = useState({
    title: '',
    subtitle: '',
    text: ''
  });
  const [modalShow, setModalShow] = useState(false);

  const getFlights = () => {
    if (
      search.origin_id === "" ||
      search.origin_id === "Elegir Aeropuerto de Origen"
    ) {
      axios
        .get(`http://localhost:8000/flights`)
        .then((response) => {
          setFlights(response.data);
        })
        .catch((error) => alert(error));
    } else {
      if (search.date_from.length === 0 && search.date_to.length === 0) {
        axios
          .get(`http://localhost:8000/flights/search/${origin_id}`)
          .then((response) => {
            setFlights(response.data);
          })
          .catch((error) => alert(error));
      } else {
        if (
          (search.date_to.length === 0 && search.date_from.length !== 0) ||
          (search.date_from.length === 0 && search.date_to.length !== 0)
        ) {
          // alert("Debe seleccionar fecha desde y fecha hasta");
          setInfo({
            title: "Advertencia",
            subtitle: "Selección Incompleta",
            text: "Debe seleccionar fecha desde y fecha hasta",
          });
          setModalShow(true);
        } else {
          if (search.date_from <= search.date_to) {
            axios
              .get(
                `http://localhost:8000/flights/search/${origin_id}/${date_from}/${date_to}`
              )
              .then((response) => {
                setFlights(response.data);
              })
              .catch((error) => alert(error));
          } else {
            //alert("Fecha desde debe ser menor o igual a fecha hasta");
            setInfo({
              title: "Advertencia",
              subtitle: "Selección incorrecta",
              text: "Fecha desde debe ser menor o igual a fecha hasta",
            });
            setModalShow(true);
          }
        }
      }
    }
  }

  const getAirports = () => {
    axios.get('http://localhost:8000/airports')
      .then(response => setAirports(response.data))
      .catch(error => alert(error))
  }

  const deleteFlight = (flightId) => {
    axios.delete(`http://localhost:8000/flights/${flightId}`)
      .then(() => {
        alert('Vuelo eliminado');
        getFlights();
      })
      .catch(error => alert(error))
  }

  useEffect(() => {
    getFlights();
  }, []);

  useEffect(() => {
    getAirports();
  }, [])
  
  const resetInputDateFrom = () => {
    setSearch({
      ...search,
      date_from: "",
    })
  };
  const resetInputDateTo = () => {
    setSearch({
      ...search,
      date_to: "",
    })
  };
  const changeSearch = (targetEvent) => {
    setSearch({
      ...search,
      [targetEvent.name]: targetEvent.value,
    })
  }

  const availableSeats = (flightId, flightOrigin, flightDest, flightDate, flightHour) =>{
      axios
      .get(`http://localhost:8000/flights/${flightId}/availables`)
      .then((response) => {
        
        setInfo ({
          title: 'Informacion de asientos',
          subtitle: 'Asientos Disponibles',
          text: 'El vuelo '+flightOrigin+"-"+flightDest+" con fecha: "+flightDate+", hora: "+flightHour+" dispone de "+response.data+" asientos libres"
        });
        
        setModalShow(true)
             })
      .catch((error) => alert(error));
      
  }
  const MostrarTodo = () =>{
    axios.get(`http://localhost:8000/flights`)
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => alert(error))
  }
  function MyVerticallyCenteredModal(props) {
     return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {info.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{info.subtitle}</h4>
          <p>
            {info.text}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const { origin_id, date_to, date_from } = search;

  return (
    <div>
      <div className="row mb-3">
        <div className="col-12">
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Fecha Desde: </label>
            </div>
            <div className="col">
              <input
                type="date"
                className="form-control"
                name="date_from"
                placeholder="date_from"
                onChange={(e) => changeSearch(e.target)}
                value={date_from}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Campo Obligatorio"
                required
              />
            </div>
            <div className="col">
              <button className="btn btn-primary" onClick={resetInputDateFrom}>
                Limpiar
              </button>
            </div>
            <div className="col">
              <label className="form-label">Fecha Hasta:</label>
            </div>
            <div className="col">
              <input
                type="date"
                className="form-control"
                name="date_to"
                placeholder="date_to"
                onChange={(e) => changeSearch(e.target)}
                value={date_to}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Campo Obligatorio"
                required
              />
            </div>
            <div className="col">
              <button className="btn btn-primary" onClick={resetInputDateTo}>
                Limpiar
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-2">
              <label className="form-label">Aeropuerto Origen:</label>
            </div>
            <div className="col-8">
              <select
                name="origin_id"
                className="form-select"
                onChange={(e) => changeSearch(e.target)}
                value={origin_id}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Campo Obligatorio"
                required
              >
                <option selected>Elegir Aeropuerto de Origen</option>
                {airports.map((airport) => (
                  <option value={airport.id}>{airport.name}</option>
                ))}
              </select>
            </div>
            <div className="col-1">
              <button className="btn btn-primary" onClick={getFlights}>
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">CODIGO DE VUELO</th>
                <th scope="col">AEROPUERTO - ORIGEN</th>
                <th scope="col">AEROPUERTO - DESTINO</th>
                <th scope="col">FECHA DEL VUELO</th>
                <th scope="col">HORA DEL VUELO</th>
                <th scope="col">AVION</th>
                <th scope="col">ASIENTOS DISPONIBLES</th>
                <th scope="col">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td>
                    <Link to={`flight/${flight.id}`}>{flight.id}</Link>
                  </td>
                  <td>{flight.origin.name}</td>
                  <td>{flight.destination.name}</td>
                  <td>{flight.flight_date}</td>
                  <td>{flight.flight_hour}</td>
                  <td>{flight.plane.brand + "-" + flight.plane.model}</td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        availableSeats(
                          flight.id,
                          flight.origin.name,
                          flight.destination.name,
                          flight.flight_date,
                          flight.flight_hour
                        )
                      }
                      className="btn btn-secondary"
                      data-toggle="tooltip"
                      title="Ver Disponibles"
                    >
                      Ver Disponibles
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteFlight(flight.id)}
                      className="btn btn-danger"
                      data-toggle="tooltip"
                      title="Eliminar"
                    >
                      <FaTrashAlt />
                    </button>
                    <Link
                      to={`flight/${flight.id}`}
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
            <Link to="flight/new">
              <button className="btn btn-warning text-white">
                Nuevo Vuelo
              </button>
            </Link>
          </div>
          <div className="col-2">
            <button
              className="btn btn-success text-white"
              onClick={MostrarTodo}
            >
              Mostrar Todo
            </button>
          </div>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default FlightsList;