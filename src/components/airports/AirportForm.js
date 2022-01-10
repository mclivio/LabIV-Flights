import axios from "axios";
import {useEffect, useState} from "react";
import {useHistory, useParams, Link} from "react-router-dom";

const AirportForm = () => {
  const history = useHistory();
  // use  useNavigate(); when using a newer version of react-router-dom
  // this would need you to replace history.push('/airports') for history('/airports')
  // in case of editing you would use history(to, { replace: true })
  // or navigate(to, {state}) if you need a state
  const {idAirport} = useParams();

  const [airport, setAirport] = useState({
    name: '',
    city: '',
    country: ''
  });

  const saveAirport = () => {
    if(idAirport) {
      axios.put(`http://localhost:8000/airports/${idAirport}`, airport)
        .then(() => { 
          alert('Se edito el aeropuerto.');
          history.push('/airports');
        })
        .catch(error => alert(error))
    } else {
      axios.post('http://localhost:8000/airports', airport)
        .then(() =>{
          alert('Se creo el aeropuerto.');
          history.push('/airports');
        })
        .catch(error => alert(error))
    }
  }

  const getAirport = () => {
    axios.get(`http://localhost:8000/airports/${idAirport}`)
      .then(response => setAirport(response.data))
      .catch(error => alert(error))
  }

  const formChange = (targetEvent) => {
    setAirport({
      ...airport,
      [targetEvent.name]: targetEvent.value,
    })
  }

  const { name, city, country } = airport;

  useEffect(() => {
    if(idAirport) {
      getAirport()
    }
  }, [idAirport])

  return (
        <div>
            <div className="mb-3">
                <label className='form-label'>Codigo</label>
                <input type='text'
                    className="form-control"
                    name='id'
                    placeholder='id'
                    value={idAirport}
                    maxLength={4}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio - Max: 4 Caracteres"
                    required
                    onChange={(e) => formChange(e.target)}
                />
            </div> 
           
            <div className="mb-3">
                <label className='form-label'>Nombre</label>
                <input type='text'
                    className="form-control"
                    name='name'
                    placeholder='name'
                    value={name}
                    maxLength={300}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio - Max: 300 Caracteres"
                    required
                    onChange={(e) => formChange(e.target)}
                />
            </div>
            <div className="mb-3">
                <label className='form-label'>Ciudad</label>
                <input type='text'
                    className="form-control"
                    name='city'
                    placeholder='city'
                    value={city}
                    maxLength={120}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio - Max: 120 Caracteres"
                    required
                    onChange={(e) => formChange(e.target)}
                />
            </div>
            <div className="mb-3">
                <label className='form-label'>Pais</label>
                <input type='text'
                    className="form-control"
                    name='country'
                    placeholder='country'
                    value={country}
                    maxLength={120}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio - Max: 120 Caracteres"
                    required
                    onChange={(e) => formChange(e.target)}
                />
            </div>
            <button className='btn btn-primary' onClick={saveAirport}>{ idAirport ? 'Editar' : 'Crear' }</button>
            <Link
                      to={`/airports`}
                      className="btn btn-secondary ml-2 text-white"
                      data-toggle="tooltip"
                      title="Editar"
                      style={{ marginLeft: 5 }}
                    >
                      Cancelar
                    </Link>
        </div>
    )
}

export default AirportForm;