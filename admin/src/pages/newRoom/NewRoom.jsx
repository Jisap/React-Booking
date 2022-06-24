import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState([]);

   const { data, loading, error } = useFetch("/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  console.log(info)

  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room })); // Crear un array (de objetos) con los numeros de las habitaciones
    try {
      await axios.post(`/rooms/${hotelId}`, { ...info, roomNumbers });  // Enviar el nuevo objeto al backend
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          
          <div className="right">
            <form>

              {roomInputs.map((input) => (  // Dibujamos los inputs del formulario
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input 
                    id={ input.id } 
                    type={ input.type } 
                    placeholder={input.placeholder} 
                    onChange={ handleChange }
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)} // Guardamos el valor del textarea ( nº de rooms) en el state
                  placeholder="give comma between room numbers."
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)} // Guardamos el valor del select ( id del hotel) en el state
                >
                  {loading
                    ? "loading"
                    : data &&                                 // Obtenida la lista de los hoteles
                      data.map(( hotel ) => (                 // Dibujamos el select con dichos hoteles
                        <option 
                          key={ hotel._id } 
                          value={ hotel._id }>
                            { hotel.name }
                        </option>
                      ))}
                </select>
              </div>

              <button onClick={ handleClick }>Send</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
