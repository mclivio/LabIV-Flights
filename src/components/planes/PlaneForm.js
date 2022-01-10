import axios from "axios";
import {useEffect, useState} from "react";
import {useHistory, useParams, Link} from "react-router-dom";
const PlaneForm = () => {
  const history = useHistory();
  // use  useNavigate(); when using a newer version of react-router-dom
  // this would need you to replace history.push('/airports') for history('/airports')
  // in case of editing you would use history(to, { replace: true })
  // or navigate(to, {state}) if you need a state

  const {idPlane} = useParams();

  const [plane, setPlane] = useState({
    brand: '',
    model: '',
    capacity: 1
  });

  const savePlane = () => {
    if(idPlane) {
      axios.put(`http://localhost:8000/planes/${idPlane}`, plane)
        .then(() => { 
          alert('Se edito el avion.');
          history.push('/planes');
        })
        .catch(error => alert(error))
    } else {
      axios.post('http://localhost:8000/planes', plane)
        .then(() =>{
          alert('Se creo el avion.');
          history.push('/planes');
        })
        .catch(error => alert(error))
    }
  }

  const getPlane = () => {
    axios.get(`http://localhost:8000/planes/${idPlane}`)
      .then(response => setPlane(response.data))
      .catch(error => alert(error))
  }

  const formChange = (targetEvent) => {
    setPlane({
      ...plane,
      [targetEvent.name]: targetEvent.value,
    })
  }

  const { brand, model, capacity } = plane;

  useEffect(() => {
    if(idPlane) {
      getPlane()
    }
  }, [idPlane])

  return (
        <div>
            <div className="mb-3">
                <label className='form-label'>Denominacion Interna</label>
                <input type='text'
                    className="form-control"
                    name='id'
                    placeholder='id'
                    value={idPlane}
                    maxLength={3}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio - Max: 3 Caracteres"
                    required
                    onChange={(e) => formChange(e.target)}
                />
            </div> 
           
            <div className="mb-3">
                <label className='form-label'>Marca</label>
                <input type='text'
                    className="form-control"
                    name='brand'
                    placeholder='brand'
                    value={brand}
                    maxLength={120}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio - Max: 120 Caracteres"
                    required
                    onChange={(e) => formChange(e.target)}
                />
            </div>
            <div className="mb-3">
                <label className='form-label'>Modelo</label>
                <input type='text'
                    className="form-control"
                    name='model'
                    placeholder='model'
                    value={model}
                    maxLength={300}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Max: 300 Caracteres"
                    onChange={(e) => formChange(e.target)}
                />
            </div>
            <div className="mb-3">
                <label className='form-label'>Capacidad</label>
                <input type='number'
                    className="form-control"
                    name='capacity'
                    placeholder='capacity'
                    value={capacity}
                    min={1}
                    step={1}
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="Campo Obligatorio"
                    required
                    onChange={e => formChange(e.target)}
                />
            </div>
            <button className='btn btn-primary' onClick={savePlane}>{ idPlane ? 'Editar' : 'Crear' }</button>
            <Link
                      to={`/planes`}
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

export default PlaneForm;