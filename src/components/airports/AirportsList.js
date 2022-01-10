import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FaRegEdit, FaTrashAlt, FaSearch} from "react-icons/fa";

const AirportsList = () => {
  const [airports, setAirports] = useState([]);
  const [search, setSearch] = useState('');

  const resetInputSearch = () => {
    setSearch('')
  };

  const getAirports = () => {
    if (search === "") {
      axios
        .get(`http://localhost:8000/airports`)
        .then((response) => {
          setAirports(response.data);
        })
        .catch((error) => alert(error));
    } else {
      axios
        .get(`http://localhost:8000/airports/search/${search}`)
        .then((response) => {
          setAirports(response.data);
        })
        .catch((error) => alert(error));
    }
  }

  const deleteAirport = (airportId) => {
    axios.delete(`http://localhost:8000/airports/${airportId}`)
      .then(() => {
        alert('Aeropuerto eliminado');
        getAirports();
      })
      .catch(error => alert(error))
  }

  const MostrarTodo = () =>{
    axios.get(`http://localhost:8000/airports`)
      .then((response) => {
        setAirports(response.data);
      })
      .catch((error) => alert(error))
  }

  useEffect(() => {
    getAirports();
  }, []);
  
  const changeSearch = (newSearch) =>{
    setSearch(newSearch);
  }

  const keyPressed = (keyEvent) => {
    if(keyEvent.charCode === 13) {
      getAirports()
    }
  }
  return (
    <div>
      <div className="row mb-3">
        <div className="col-9">
          <input
            placeholder="Buscar por nombre..."
            className="form-control"
            name="search"
            value={search}
            onKeyPress={keyPressed}
            onChange={(e) => changeSearch(e.target.value)}
          />
        </div>
        <div className="col-1">
          <button className="btn btn-primary" onClick={getAirports}>
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
                <th scope="col">CODIGO</th>
                <th scope="col">NOMBRE</th>
                <th scope="col">CIUDAD</th>
                <th scope="col">PAIS</th>
                <th scope="col">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport) => (
                <tr key={airport.id}>
                  <td>
                    <Link to={`airport/${airport.id}`}>{airport.id}</Link>
                  </td>
                  <td>{airport.name}</td>
                  <td>{airport.city}</td>
                  <td>{airport.country}</td>
                  <td>
                    <button
                      onClick={() => deleteAirport(airport.id)}
                      className="btn btn-danger"
                      data-toggle="tooltip"
                      title="Eliminar"
                    >
                      <FaTrashAlt />
                    </button>
                    <Link
                      to={`airport/${airport.id}`}
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
            <Link to="airport/new">
              <button className="btn btn-warning text-white">
                Nuevo Aeropuerto
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

export default AirportsList;