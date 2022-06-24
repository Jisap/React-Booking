import React, { useContext, useState } from 'react';
import './header.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from '../../context/SearchContext';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ type }) => {

  const [destination, setDestination] = useState("")
  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [options, setOptions] = useState({
    adult:1,
    children:0,
    room:1,
  })

  const handleOption = ( name, operation ) => {                           // Recibimos el nombre de la opcion y la operacion a realizar +1 o -1
    console.log( {[name]: operation} );                                   // Valor de la operación ("i" o "d" asociado al nombre de la option)
    setOptions( ( prev ) => {                                             // prev es el estado anterior del objeto options
      return {
        ...prev,                                                          // ...prev es para que no se pierdan los valores del objeto prev
        [name]: operation === "i" ? options[name] +1 : options[name] -1   // Si la operacion es "i" sumamos 1 al valor de la opcion, si es "d" restamos 1
      }  
    })
  }

  const navigate = useNavigate();                                                   // Hook para navegar entre rutas. 
  
  const { dispatch } = useContext(SearchContext);                                   // Obtenemos el dispatch del contexto 
  
  const handleSearch = () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });      // Enviamos los datos al contexto
    navigate("/hotels", { state:{ destination, dates, options }});                   // Navegamos a la ruta /hotels con los datos de la busqueda
  }

  const { user } = useContext( AuthContext );

  return (
        //dp:flex jcc
    <div className="header">
          {/* width:100% max-width:1024 pos:relative*/}
      <div className={ type === "list" ? "headerContainer listMode" : "headerContainer" }>
              {/* dp: flex */}
        <div className="headerList">
                {/* dp: flex aic  */}
            <div className="headerListItem active">
                <FontAwesomeIcon icon={ faBed } />
                <span>Stays</span>
            </div>
            <div className="headerListItem">
                <FontAwesomeIcon icon={ faPlane } />
                <span>Fligths</span>
            </div>
            <div className="headerListItem">
                <FontAwesomeIcon icon={ faCar } />
                <span>Cart rentals</span>
            </div>
            <div className="headerListItem">
                <FontAwesomeIcon icon={ faBed } />
                <span>Attractions</span>
            </div>
            <div className="headerListItem">
                <FontAwesomeIcon icon={ faTaxi } />
                <span>Airport taxis</span>
            </div>
        </div>
        
        { type !== "list" &&
          <>
          <h1 className="headerTitle">A lifetime of discounts ? It's Genius</h1>
          <p className="headerDesc">Get rewarded for your travels - unlock instant savings of 10% or more with a free Jisapbooking account</p> 
         
          {!user && <button className="headerBtn">Sign in / Register</button>}

            {/* dp:flex aic jc:space-around pos:absolute */}
          <div className="headerSearch">

                {/* dp:flex aic */}
            <div className="headerSearchItem">
              <FontAwesomeIcon icon={faBed} className="headerIcon" />
              <input 
                type="text" 
                placeholder="Where are you going ?" 
                className="headerSearchInput"
                onChange={ e => setDestination( e.target.value )}

              />
            </div>

            <div className="headerSearchItem">
              <FontAwesomeIcon icon={ faCalendarDays } className="headerIcon"/>
              <span 
                onClick={() => setOpenDate(!openDate)}
                className="headerSearchText">{ `${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
                { openDate &&
                    <DateRange
                      className="date" // pos:absolute
                      editableDateInputs={true}
                      onChange={item => setDates([item.selection])} // Cuando se introducen las fechas se genera unos item.selection => Date[]
                      moveRangeOnFirstSelection={false}
                      ranges={ dates }
                      minDate={ new Date() }

                />}
            </div>

            <div className="headerSearchItem">
              <FontAwesomeIcon icon={ faPerson } className="headerIcon"/>
              <span  onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adult · ${options.children} children · ${options.room} rooms`}</span>
              {/* pos:absolute */}
              { openOptions &&  
                <div className="options">
                    
                    {/* dp:flex width:200px jc:space-between */} 
                  <div className="optionItem">
                    <span className="optionText">Adult</span> 
                      {/* dp:flex aic */}
                    <div className="optionCounter">
                      <button 
                        className="optionCounterButton" 
                        onClick={() => handleOption("adult", "d")}
                        disabled={ options.adult <= 1 }>-</button>
                      <span className="optionCounterBumber">{ options.adult }</span>
                      <button 
                        className="optionCounterButton" 
                        onClick={() => handleOption("adult", "i")}>+</button>
                    </div>
                  </div>

                  <div className="optionItem">
                    <span className="optionText">Children</span>
                    <div className="optionCounter">
                      <button 
                        className="optionCounterButton" 
                        onClick={() => handleOption("children", "d")}
                        disabled={ options.children <= 1 }>-</button>
                      <span className="optionCounterBumber">{ options.children }</span>
                      <button className="optionCounterButton" onClick={() => handleOption("children", "i")}>+</button>
                    </div>
                  </div>
                  
                  <div className="optionItem">
                    <span className="optionText">Room</span>
                    <div className="optionCounter">
                      <button
                      className="optionCounterButton" 
                      onClick={() => handleOption("room", "d")}
                      disabled={ options.room <= 1 }>-</button>
                      <span className="optionCounterBumber">{ options.room }</span>
                      <button className="optionCounterButton" onClick={() => handleOption("room", "i")}>+</button>
                    </div>
                  </div>

                </div>
              }
            </div>

            <div className="headerSearchItem">
              <button className="headerBtn" onClick={ handleSearch }>Search</button>
            </div>

          </div>
          </>
        }
      </div>
    </div>
  )
}

export default Header