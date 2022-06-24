import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);

   const { data, loading, error } = useFetch("/rooms");

  const handleChange = (e) => {     //Clave         //Valor
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(     // Convertimos el valor del input (html object) a un array
      e.target.selectedOptions,   // Para ello obtenemos los valores seleccionados,
      (option) => option.value    // y de ellos obtenemos el valor de cada opción
    );
    setRooms(value);              // Al final asignamos esos valores seleccionados a la variable rooms (array)
  };

  console.log(files)

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const list = await Promise.all(                                 // Promesas en paralelo para lista de fotos del hoterl
        Object.values(files).map(async (file) => {                    // para cada archivo en el array de archivos
          const data = new FormData();                                // creamos un objeto FormData
          data.append("file", file);                                  // Y agregamos dicho archivo  
          data.append("upload_preset", "uploadBooking");                     // También agregamos un preset
          const uploadRes = await axios.post(                         // Y enviamos el archivo a Cloudinary
            "https://api.cloudinary.com/v1_1/downe22q2/image/upload", // obteniendo como respuesta una data
            data
          );

          const { url } = uploadRes.data; // De la data obtenemos la url de la imagen
          return url;                     // El resultado de la promesa es la url de la imagen
        })                                // List contendrá un array con las urls de las imagenes
      );

      const newhotel = {                 // Creamos un nuevo objeto con los datos del formulario del nuevo hotel      
        ...info,                         // los valores del formulario              
        rooms,                           // los números de las habitaciones
        photos: list,                    // las urls de las imagenes del hotel 
      };

      await axios.post("/hotels", newhotel); // Enviamos el nuevo objeto al backend
    } catch (err) {console.log(err)}
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={ input.id }>
                  <label>{input.label}</label>
                  <input 
                    type={input.type} 
                    placeholder={ input.placeholder }
                    id={ input.id }
                    onChange={ handleChange }
                  />
                </div>
              ))}
              <div className="formInput" >
                <label>Featured</label>
                <select
                  id="featured"
                  onChange={ handleChange }
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRooms" >
                <label>Rooms</label>
                <select
                  id="rooms"
                  multiple
                  onChange={ handleSelect }
                >
                  {loading                                          // Si está cargando, 
                    ? "loading"                                     // mostramos un "loading" 
                    : data &&                                       // si terminó de cargar es que tenemos la data
                      data.map((room) => (                          // y podemos iterarla obteniendo cada una de las habitaciones -> option
                        <option key={room._id} value={room._id}>    
                          {room.title}
                        </option>
                      ))}
                </select>
              </div>
              <button
                onClick={ handleClick }
              >Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
