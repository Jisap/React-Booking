import { createContext, useReducer } from "react";


const INITIAL_STATE = {
  city: undefined,
  dates: [],
  options: {
    adult: undefined,
    children: undefined,
    room: undefined,
  },
};

export const SearchContext = createContext( INITIAL_STATE );

const SearchReducer = (state, action) => {

  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload; // Contendrá los datos del initial_state generados en el header al buscar un hotel

    case "RESET_SEARCH":
      return INITIAL_STATE; // Reseteará el estado del contexto

    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};