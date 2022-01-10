import axios from "axios";
import {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import FlightsList from "../flights/FlightsList";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

const TicketForm = () => {
  const [flights, setFlights] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [allTickets, setAllTickets] = useState([]);
  const history = useHistory();
  // use  useNavigate(); when using a newer version of react-router-dom
  // this would need you to replace history.push('/airports') for history('/airports')
  // in case of editing you would use history(to, { replace: true })
  // or navigate(to, {state}) if you need a state

  const {flights_id, seat_number} = useParams();

  const [info, setInfo] = useState({
    title: '',
    subtitle: '',
    text: ''
  });
  const [modalShow, setModalShow] = useState(false);

  const [ticket, setTicket] = useState({
    passenger_name: '',
    passport: '',
  });

  const getFlights = () => {
    axios.get('http://localhost:8000/flights')
      .then(response => setFlights(response.data))
      .catch(error => alert(error))
  }

  const getPlanes = () => {
    axios.get('http://localhost:8000/planes')
      .then(response => setPlanes(response.data))
      .catch(error => alert(error))
  }

  const getAllTickets = () =>{
    axios.get(`http://localhost:8000/tickets`)
      .then(response => setAllTickets(response.data))
      .catch(error => alert(error))
  }

  const saveTicket = () => {
    
    if(flights_id && seat_number) {
          axios
            .put(
              `http://localhost:8000/tickets/${flights_id}/${seat_number}`,
              ticket
            )
            .then(() => {
              alert("Se edito el pasaje");
              history.push("/tickets");
            })
            .catch((error) => alert(error));
    } else {
      let occupied=false
      allTickets.map((t) => {
        
        if (t.flights_id == ticket.flights_id && t.seat_number == ticket.seat_number) {
          occupied=true
          
        }
      });
        if(occupied===false){
          axios.post('http://localhost:8000/tickets', ticket)
          .then(() =>{
            alert('Se creo el pasaje');
            history.push('/tickets');
          })
          .catch((error) => alert(error))
        }
        else{
          setInfo({
            title: 'Advertencia',
            subtitle: 'Selección incorrecta',
            text: "Asiento Ocupado para el vuelo seleccionado",
          });
          setModalShow(true)
        }
       
    }
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

  const getTicket = () => {
    axios.get(`http://localhost:8000/tickets/${flights_id}/${seat_number}`)
      .then(response => setTicket(response.data))
      .catch(error => alert(error))
  }

  const formChange = (targetEvent) => {
    setTicket({
      ...ticket,
      [targetEvent.name]: targetEvent.value,
    })
  }

  const cantAsientos = () => {
    var planeId;
    var planeCapacity = 0;
    flights.map(flight => {
      if (flight.id === ticket.flights_id)
       planeId = flight.plane_id;
      })
    planes.map(plane => {
      if (plane.id === planeId)
      planeCapacity = plane.capacity;
    })
    return planeCapacity
  }

  const { passenger_name, passport} = ticket;

  useEffect(() => {
    getFlights();
  }, [])

  useEffect(() => {
    getPlanes();
  }, [])

  useEffect(()=>{
    getAllTickets();
  }, [])

  useEffect(() => {
    if(seat_number !== 0 && seat_number !== undefined && flights_id !== '' && flights_id !== undefined) {
      getTicket(); 
    }
  }, [flights_id, seat_number])

  return (
    <div>
    <div className="mb-3">
            <label className='form-label'>Pasaporte del Pasajero</label>
            <input type='text'
                className="form-control"
                name='passport'
                placeholder='passport'
                value={passport}
                onChange={(e) => formChange(e.target)}
            />
        </div> 
        <div className="mb-3">
        <label className="form-label">Vuelo</label>
        <select name="flights_id"
          className="form-select"
          onChange={(e) => formChange(e.target)}
          value={flights_id}
        >
          <option selected>Elegir Vuelo</option>
          {flights.map((flight) => (
            <option value={flight.id}>{flight.id}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
            <label className='form-label'>Nombre del Pasajero</label>
            <input type='text'
                className="form-control"
                name='passenger_name'
                placeholder='passenger_name'
                value={passenger_name}
                onChange={(e) => formChange(e.target)}
            />
        </div> 
      <div className="mb-3">
                <label className='form-label'>Numero de Asiento</label>
                <input type='number'
                    className="form-control"
                    name='seat_number'
                    placeholder='seat_number'
                    value={seat_number}
                    min={1}
                    step={1}
                    max={cantAsientos()}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio"
                    required
                    onChange={(e) => formChange(e.target)}
                />
            </div>
      <button id='asdasd' className="btn btn-primary" onClick={saveTicket}>{ (flights_id && seat_number) ? 'Editar' : 'Crear' }</button>
      <Link
                      to={`/tickets`}
                      className="btn btn-secondary ml-2 text-white"
                      data-toggle="tooltip"
                      title="Editar"
                      style={{ marginLeft: 5 }}
                    >
                      Cancelar
                    </Link>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default TicketForm;