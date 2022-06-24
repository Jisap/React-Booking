import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Axios } from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SearchContext } from '../../context/SearchContext';
import useFetch from '../../hooks/useFetch';
import './reserve.css';

const Reserve = ({ setOpen, hotelId }) => {                             // Modal para reserva de habitaciones del hotel

  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`); // Obtenemos los datos del hotel según el id
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { dates } = useContext( SearchContext );                        // Las fechas vienen en un rango de fechas (startDate - endDate)

  const getDatesInRange = (startDate, endDate) => {
    
    const start = new Date(startDate);  // Convierte la fecha de inicio a un objeto Date
    const end = new Date(endDate);      // Lo mismo con la fecha final    

    const date = new Date(start.getTime()); // Copiamos la fecha de inicio a una nueva variable

    const dates = [];                       // Creamos un array vacio para guardar las fechas

    while (date <= end) {                       // Hacemos un bucle que recorra todas las fechas entre la fecha de inicio y la fecha final
      dates.push(new Date(date).getTime());     // Añadimos la fecha a la lista de fechas (copia) como un timestamp
      date.setDate(date.getDate() + 1);         // Sumamos 1 dia a la fecha -> seguimos recorriendo todas las fechas
    }

    return dates;                               // Devolvemos las fechas seleccionadas para las reservas de las habitaciones como timestamps
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate); 

  const isAvailable = (roomNumber) => {                                   // El nº de la habitación sale de la data cuando hacemos fetch
    const isFound = roomNumber.unavailableDates.some((date) =>            // Buscamos en la lista de fechas NO disponibles una fecha
      alldates.includes(new Date(date).getTime())                         // que se encuentre entre las seleccionadas para reserva
    );                                                                    // Si encuentra una fecha no disponible, devuelve true  

    return !isFound;    // Retornamos lo contrario, es decir las fechas disponibles
  };

  const handleSelect = (e) => {
    const checked = e.target.checked  // Campo donde se hizo check
    const value = e.target.value      // Valor de ese check = id de la room
    setSelectedRooms(
        checked                                                 // Si se hizo check en una habitación
        ? [...selectedRooms, value]                             // Agregamos la habitación al array de habitaciones seleccionadas
        : selectedRooms.filter((item) => item !== value)        // Si no se hizo check en una habitación eliminamos la habitación del array
    )  
  }

  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {                            // Para cada habitación reservada 
          const res = Axios.put(`/rooms/availability/${roomId}`, { // Modificamos en bd la disponibilidad de la misma
            dates: alldates,                                       // Con todas las fechas seleccionadas
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) {}
  };


  return (
    <div className="reserve">
        <div className="rContainer">
            <FontAwesomeIcon 
                icon={ faCircleXmark }
                className="rClose"
                onClick={ () => setOpen(false) }    
            />
            <span>Select your rooms:</span>
            { data.map( (item) => ( 
                <div className="rItem" key={item._id}>
                    <div className="rItemInfo">
                        <div className="rTitle">{ item.title }</div>
                        <div className="rDesc">{ item.desc }</div>
                        <div className="rMax">Max peopple: <b>{ item.maxPeople }</b></div>
                        <div className="rPrice">{ item.price }</div>
                    </div>
                        <div className="rSelectRooms">
                            { item.roomNumbers.map( roomNumber => (
                                <div className="room">
                                        <label>{ roomNumber.number }</label>
                                        <input 
                                            type="checkbox" 
                                            value={ roomNumber._id }
                                            onChange={ handleSelect }
                                            disabled={ !isAvailable(roomNumber) } // Si la habitación está ocupada, no se puede seleccionar
                                        />
                                </div>
                            ))}
                        </div>
                </div>
            ))}
            <button 
                onClick={ handleClick }
                className="rButton">
                Reserve Now
            </button>
        </div>
    </div>
  )
}

export default Reserve