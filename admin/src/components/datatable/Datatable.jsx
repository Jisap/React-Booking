import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import  useFetch  from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => { // Recibimos las columnas de la tabla desde las rutas en app.js
  
  const location = useLocation();
  const path = location.pathname.split("/")[1];        // Obtenemos el path de la página actual 
  const { data, loading, error, reFetch } = useFetch(`/${path}`); //[{}] Establecemos el estado de la información de cada row
  const [list, setList] = useState([]);

  useEffect(() => {     
    setList(data);    // Cada vez que cambie el estado de la data (rows) se actualiza el estado de la lista
    reFetch(`/${path}`)
  }, [data]);
  
  const handleDelete = async(id) => {
    try {
       await axios.delete(`/${path}/${id}`);            // Elimina el usuario de la base de datos
       setList(list.filter((item) => item._id !== id)); // Elimina el row de la lista que coincida con el id del argumento
    } catch (error) {}
  };

  const actionColumn = [  // Definición de la columna de action donde se puede ver o eliminar un usario
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}                             // Establecemos el estado de la información de cada row
        columns={columns.concat(actionColumn)}  // Establecemos el estado de las columnas de la tabla + la columna de action
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={ (row) => row._id } // La data de cada row tiene un campo _id que es el id de la row
      />
    </div>
  );
};

export default Datatable;
