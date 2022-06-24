import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Header from '../../components/header/Header'
import MailList from '../../components/mailList/MailList'
import Navbar from '../../components/navbar/Navbar'
import "./hotel.css"
import Footer from "../../components/footer/footer";
import useFetch from "../../hooks/useFetch"
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';
import { AuthContext } from '../../context/AuthContext';
import Reserve from '../../components/reserve/Reserve';

const Hotel = () => {

  const location = useLocation();    // Desde el searchItem recibimos '/hotel/342029842948'. De aquí obtendremos el id del hotel
  const id = location.pathname.split("/")[2]; // id del hotel


  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);            // Estado para abrir o cerrar el modal del slide
  const { user } = useContext( AuthContext );         // Usuario logueado
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);  // Estado para abrir o cerrar el modal de la reserva de la habitación

  const { data, loading, error } = useFetch(`/hotels/find/${id}`); // Obtenemos los datos del hotel según el id

  const { dates, options } = useContext(SearchContext);            // Obtenemos los datos del contexto de busqueda (fechas y opciones) establecidos en el header

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;                // Milliseconds per day
  function dayDifference(date1, date2) {                           // Calculate the number of days between two dates
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());  // Calculate the time difference between two dates in milliseconds
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);   // Convert to days and return
    return diffDays;                                               // Return the number of days between two dates
  }  

   const days = dayDifference(dates[0].endDate, dates[0].startDate); // Nº Dias entre dos fechas

  const handleOpen = ( i ) => { 
    setSlideNumber( i )
    setOpen(true)
  }

  const handleMove = ( direction ) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  }

  const handleClick = () => {
    if( user ){
      setOpenModal(true);
    }else{
      navigate("/login")
    }
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      
      {/* dp:flex fd:column aic:center --> hotelContainer*/ }

      { loading ? ( "laoding" ) : (

        <div className="hotelContainer">

          { open && (
            // pos:sticky dp:flex aic background-color: width:100vw height:100vh
            <div className="slider">

              <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="close" // pos:absolute
                  onClick={() => setOpen(false)}
                />

                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  className="arrow"
                  onClick={() => handleMove("l")}
                />

                {/* width:100% height:100% dp:flex jc:center aic */}
                <div className="sliderWrapper">
                                                        {/* width:80% height:80vh */}
                  <img src={data.photos[slideNumber]} alt="" className="sliderImg" />
                </div>

                <FontAwesomeIcon
                  icon={faCircleArrowRight}
                  className="arrow"
                  onClick={() => handleMove("r")}
                />
            </div>
          
          )}
          
          {/* width:100% max-width: 1024 dp:flex fd:column pos:relative */}
          <div className="hotelWrapper">
            
            {/* pos: absolute */}
            <button className="bookNow">Reserve or Book Now</button>
            <h1 className="hotelTitle">{ data.name }</h1>
            {/* dp: flex aic:center */}
            <div className="hotelAddress">
              <FontAwesomeIcon icon={ faLocationDot } />
              <span>{ data.address }</span>
            </div>
            <span className="hotelDistance">
              Excellent location - { data.distance }m from center
            </span>
            <span className="hotelPriceHighlight">
              Book a stay over ${ data.cheapestPrice } at this property and get a free airport taxi
            </span>
            {/* dp:flex flex:wrap jc: space-between */}
            <div className="hotelImages">
              { data.photos?.map( (photo, i) => (
                <div className="hotelImgWrapper" key={ i }>
                  <img 
                    onClick={ () => handleOpen( i ) } 
                    src={ photo } 
                    alt="hotel" 
                    className="hotelImg"/>
                </div>
              ))}
            </div>

            {/* dp:flex jc:space-between */}
            <div className="hotelDetails">
              {/* flex:3 */}
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{ data.title }</h1>
                <p className="hotelDesc">
                  { data.desc }
                </p>
              </div>
              {/*  flex:1 dp:flex fd: column */}
              <div className="hotelDetailsPrice">
                  <h1>Perfect for a { days }-night stay!</h1>
                  <span>
                    Located in the real heart of Krakow, this property has an
                    excellent location score of 9.8!
                  </span>
                  <h2>
                    <b>${ days * data.cheapestPrice * options.room }</b> ({ days } nights)
                  </h2>
                  <button
                    onClick={ handleClick }
                  >Reserve or Book Now!</button>
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}

      { openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}

    </div>
  )
}

export default Hotel