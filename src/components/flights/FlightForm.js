import axios from "axios";
import {useEffect, useState} from "react";
import {useHistory, useParams, Link} from "react-router-dom";

const FlightForm = () => {
  const [airports, setAirports] = useState([]);
  const [planes, setPlanes] = useState([]);

  const history = useHistory();
  // use  useNavigate(); when using a newer version of react-router-dom
  // this would need you to replace history.push('/airports') for history('/airports')
  // in case of editing you would use history(to, { replace: true })
  // or navigate(to, {state}) if you need a state

  const {idFlight} = useParams();

  const [flight, setFlight] = useState({
    origin_id: '',
    destination_id: '',
    flight_date: new Date(),
    flight_hour: new Date().toLocaleTimeString,
    plane_id: ''
  });

  const getAirports = () => {
    axios.get('http://localhost:8000/airports')
      .then(response => setAirports(response.data))
      .catch(error => alert(error))
  }

  const getPlanes = () => {
    axios.get('http://localhost:8000/planes')
      .then(response => setPlanes(response.data))
      .catch(error => alert(error))
  }

  const saveFlight = () => {
    if(idFlight) {
      console.log(flight)
      axios.put(`http://localhost:8000/flights/${idFlight}`, flight)
        .then(() => { 
          alert('Se edito el vuelo');
          history.push('/flights');
        })
        .catch(error => alert(error))
    } else {
      axios.post('http://localhost:8000/flights', flight)
        .then(() =>{
          alert('Se creo el vuelo');
          history.push('/flights');
        })
        .catch(error => alert(error))
    }
  }

  const getFlight = () => {
    axios.get(`http://localhost:8000/flights/${idFlight}`)
      .then(response => setFlight(response.data))
      .catch(error => alert(error))
  }

  const formChange = (targetEvent) => {
    setFlight({
      ...flight,
      [targetEvent.name]: targetEvent.value,
    })
  }

  const { origin_id, destination_id, flight_date, flight_hour, plane_id } = flight;

  useEffect(() => {
    getAirports();
  }, [])

  useEffect(() => {
    getPlanes();
  }, [])

  useEffect(() => {
    if(idFlight !== '' && idFlight !== undefined) {
      getFlight();
    }
  }, [idFlight])

  return (
    <div>
    <div className="mb-3">
            <label className='form-label'>Codigo de Vuelo</label>
            <input type='text'
                className="form-control"
                name='id'
                placeholder='id'
                value={idFlight}
                maxLength={5}
                data-toggle="tooltip" 
                data-placement="bottom" 
                title="Campo Obligatorio - Max: 5 Caracteres"
                required
                onChange={(e) => formChange(e.target)}
            />
        </div> 
       
      <div className="mb-3">
        <label className="form-label">Aeropuerto Origen</label>
        <select name="origin_id"
          className="form-select"
          onChange={(e) => formChange(e.target)}
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
      <div className="mb-3">
        <label className="form-label">Aeropuerto Destino</label>
        <select name="destination_id"
          className="form-select"
          onChange={(e) => formChange(e.target)}
          value={destination_id}
          data-toggle="tooltip" 
          data-placement="bottom" 
          title="Campo Obligatorio"
          required
        >
          <option selected>Elegir Aeropuerto de Destino</option>
          {airports.map((airport) => (
            <option value={airport.id}>{airport.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha del Vuelo</label>
        <input type="date"
          className="form-control"
          name="flight_date"
          placeholder="flight_date"
          onChange={(e) => formChange(e.target)}
          value={flight_date}
          data-toggle="tooltip" 
          data-placement="bottom" 
          title="Campo Obligatorio"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Hora del Vuelo</label>
        <input type="time"
          className="form-control"
          name="flight_hour"
          placeholder="flight_hour"
          onChange={(e) => formChange(e.target)}
          value={flight_hour}
          data-toggle="tooltip" 
          data-placement="bottom" 
          title="Campo Obligatorio"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Avion</label>
        <select name="plane_id"
          className="form-select"
          onChange={(e) => formChange(e.target)}
          value={plane_id}
          data-toggle="tooltip" 
          data-placement="bottom" 
          title="Campo Obligatorio"
          required
        >
          <option selected>Elegir Avion</option>
          {planes.map((plane) => (
            <option value={plane.id}>{plane.brand} - {plane.model}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={saveFlight}>{ idFlight ? 'Editar' : 'Crear' }</button>
      <Link
                      to={`/flights`}
                      className="btn btn-secondary ml-2 text-white"
                      data-toggle="tooltip"
                      title="Editar"
                      style={{ marginLeft: 5 }}
                    >
                      Cancelar
                    </Link>
    </div>
  );
};

export default FlightForm;