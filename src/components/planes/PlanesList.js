import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import { FaRegEdit, FaTrashAlt, FaSearch } from "react-icons/fa";

const PlanesList = () => {
  const [planes, setPlanes] = useState([]);
  const [search, setSearch] = useState('');

  const resetInputSearch = () => {
    setSearch('')
  };

  const getPlanes = () => {
    if (search==='')
    {
      axios.get(`http://localhost:8000/planes`)
      .then((response) => {
        setPlanes(response.data);
      })
      .catch((error) => alert(error))
    }
    else
    {
    axios.get(`http://localhost:8000/planes/search/${search}`)
    .then((response) => {
      setPlanes(response.data);
    })
    .catch((error) => alert(error))
    }
  }

  const deletePlane = (planeId) => {
    axios.delete(`http://localhost:8000/planes/${planeId}`)
      .then(() => {
        alert('Avion eliminado');
        getPlanes();
      })
      .catch(error => alert(error))
  }

  const MostrarTodo = () =>{
    axios.get(`http://localhost:8000/planes`)
    .then((response) => {
      setPlanes(response.data);
    })
    .catch((error) => alert(error))
  }

  useEffect(() => {
    getPlanes();
  }, []);
  
  const changeSearch = (newSearch) =>{
    setSearch(newSearch);
  }

  const keyPressed = (keyEvent) => {
    if(keyEvent.charCode === 13) {
      getPlanes()
    }
  }
  return (
    <div>
      <div className="row mb-3">
        <div className="col-9">
          <input
            placeholder="Buscar por marca..."
            className="form-control"
            name="search"
            value={search}
            onKeyPress={keyPressed}
            onChange={(e) => changeSearch(e.target.value)}
          />
        </div>
        <div className="col-1">
          <button className="btn btn-primary" onClick={getPlanes}>
            <FaSearch />
          </button>
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={resetInputSearch}>
            Limpiar
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">MARCA</th>
                <th scope="col">MODELO</th>
                <th scope="col">DENOMINACION INTERNA</th>
                <th scope="col">CAPACIDAD DE PASAJEROS</th>
                <th scope="col">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((plane) => (
                <tr key={plane.id}>
                  <td>{plane.brand}</td>
                  <td>{plane.model}</td>
                  <td>
                    <Link to={`plane/${plane.id}`}>{plane.id}</Link>
                  </td>
                  <td>{plane.capacity}</td>
                  <td>
                    <button
                      onClick={() => deletePlane(plane.id)}
                      className="btn btn-danger"
                      data-toggle="tooltip"
                      title="Eliminar"
                    >
                      <FaTrashAlt />
                    </button>
                    <Link
                      to={`plane/${plane.id}`}
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
            <Link to="plane/new">
              <button className="btn btn-warning text-white">
                Nuevo Avion
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
    </div>
  );
};

export default PlanesList;