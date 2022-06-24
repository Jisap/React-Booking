import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});

  const handleChange = (e) => {     //Clave         //Valor
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();                                    // Crear un objeto FormData
    data.append("file", file);                                      // Agregar un archivo
    data.append("upload_preset", "uploadBooking");                  // Agregar un preset
    try {
      const uploadRes = await axios.post(                           //Enviar el archivo a Cloudinary
        "https://api.cloudinary.com/v1_1/downe22q2/image/upload",
        data
      );
      
      const { url } = uploadRes.data; // Obtener la url de la imagen

      const newUser = { // Crear un nuevo objeto con los datos del formulario más la url de la imagen
        ...info,
        img: url,
      };

      // console.log(info);
      console.log(newUser)

      await axios.post("/auth/register", newUser); // Enviar el nuevo objeto al backend
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
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
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
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input 
                    type={input.type} 
                    placeholder={input.placeholder} 
                    onChange={ handleChange }  
                    id={input.id}
                  />
                </div>
              ))}
              <button onClick={ handleClick }>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
