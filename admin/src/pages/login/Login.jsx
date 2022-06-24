import "./login.scss"
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";



const Login = () => {

  const [credentials, setCredentials] = useState({ 
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()


  const handleChange = (e) => {             // inputs - valor de los inputs
    setCredentials( (prev) => ({ ...prev, [e.target.id]: e.target.value })); // Se establece el nuevo estado para las credentials
  }

  const handleClick = async(e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try{
        const res = await axios.post( "/auth/login", credentials );       // Se hace el request al backend enviando las credentials
        console.log(res)
        if( res.data.isAdmin){                                            // Si el usuario devuelto es admin se redirige al home de la página de admin
          dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details }); // y se cambia el estado del contexto desde res.data.details
          navigate("/");
        }else{
          dispatch({ type: "LOGIN_FAILURE", payload: { message: "You are not allowed!"} });  
        }
    }catch(err){
        console.log(err);
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };


  return (
    <div className="login">
        <div className="lContainer">
            <input 
                type="text" 
                placeholder="username"  
                id="username" 
                className="lInput" 
                onChange={ handleChange }
            />
            <input 
                type="password" 
                placeholder="password"  
                id="password" 
                className="lInput" 
                onChange={ handleChange }
            />
            <button 
                className="lButton"
                disabled={ loading }
                onClick={ handleClick }    
            >
                Login
            </button>

            { error && <span>{ error.message }</span>}
        
        </div>
    </div>
  )
}

export default Login