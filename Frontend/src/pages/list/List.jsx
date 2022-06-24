import React, { useState } from 'react'
import "./list.css"
import Navbar from '../../components/navbar/Navbar'
import Header from '../../components/header/Header'
import { useLocation } from "react-router-dom"
import { format } from "date-fns";
import { DateRange } from 'react-date-range'
import Searchitem from '../../components/searchItem/Searchitem'
import useFetch from '../../hooks/useFetch'

const List = () => {

  const location = useLocation();     // Recibimos la url de la página actual y el state lanzado por el navigate desde el header con { destination, date, options }

  const [destination, setDestination] = useState( location.state.destination ); // Rellenamos los states desde location.state
  const [dates, setDates] = useState( location.state.dates );
  const [options, setOptions] = useState( location.state.options );
  const [openDate, setOpenDate] = useState(false)
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);

  const { data, loading, error, reFetch } = useFetch(`/hotels?city=${destination}&min=${min || 0}&max=${max || 999}`); // Obtenemos los hoteles según destination

  const handleClick = () => {
    reFetch();                  // Repetimos la petición para obtener los hoteles esta vez con nuevos parametros
  }

  console.log(data);

  return (

    <div>
      <Navbar />
      <Header type="list" />
      {/* dp:flex jc:center */}
      <div className="listContainer">
        {/* width:100% max-width:1024px dp:flex */}
        <div className="listWrapper">
          {/* flex:1 pos:sticky height:max-content */}
          <div className="listSearch">
            {/* dp:flex fd: column */}
            <h1 className="lsTitle">Search</h1>
            
            {/* dp:flex fd:column */}
            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={ destination } type="text" />
            </div>

            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{ `${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {
                openDate &&
                  <DateRange
                    onChange={ item => setDates([item.selection])}
                    minDate={ new Date() } 
                    ranges={ dates }
                  />
              }
            </div>

            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">

                {/* dp:flex jc:space-between mb:10px*/}
                <div className="lsOptionItem">
                  <span className="lsOptionText">Min Price <small>per nigth</small></span>
                  <input 
                    type="number" 
                    className="lsOptionInput" 
                    onChange={ e => setMin( e.target.value )}  
                    />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Max Price <small>per nigth</small></span>
                  <input 
                    type="number" 
                    className="lsOptionInput" 
                    onChange={ e => setMax( e.target.value )}    
                    />
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input type="number" min={1} className="lsOptionInput" placeholder={ options.adult }/>
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input type="number" min={0} className="lsOptionInput" placeholder={ options.children }/>
                </div>

                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input type="number" min={1} className="lsOptionInput" placeholder={ options.room }/>
                </div>
              </div>

            </div>
          
          <button onClick={ handleClick }>Search</button>

          </div>

          {/* flex:3 */}
          <div className="listResult">
            { loading ? ("loading") : (
              <>
                { data.map((item) => (
                  <Searchitem item={item} key={item._id}/> // Enviamos el item al Searchitem
                ))}
              </>
            )}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default List