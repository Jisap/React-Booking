import { createContext, useEffect, useReducer } from "react";


const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Recupera el usuario del localstorage (esta como string) y lo convierte a objeto json
  loading: false,
  error: null,
};

export const AuthContext = createContext( INITIAL_STATE );

const AuthReducer = (state, action) => {

  switch (action.type) {

    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      }

   case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      }

    case "LOGIN_FAILURE":
      return {
        user: null, 
        loading: false,
        error: action.payload,
      }

    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      }

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user))        // Guarda el objeto usuario en el localstorage convirtiendolo a string
  }, [state.user]);                                                 // Cada vez que cambie el state.user, cambiaremos el localstorage

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};