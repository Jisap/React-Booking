import React from 'react'
import useFetch from '../../hooks/useFetch'
import "./featuredProperties.css"
import { faChampagneGlasses, faCircleRight } from '@fortawesome/free-solid-svg-icons'

const FeaturedProperties = () => {

  const { data, loading, error } = useFetch("/hotels?featured=true&limit=4")

  return (

    // width:100% max-width:1024px dp:flex jc:space-between 
    <div className="fp">
      { loading ? ("Loading" ) : ( 
        <>
          { data.map((item) => (
            <div key={item._id}>
              {/* flex:1 dp:flex fd:column  */}
              <div className="fpItem" key={item._id}>
                
                <img
                    src={ item.photos[0]}
                    alt=""
                    className="fpImg"
                />

                <span className="fpName">{ item.name }</span>
                <span className="fpCity">{ item.city }</span>
                <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
                  
                  { item.rating && 
                    <div className="fpRating">
                      <button>{ item.rating }</button>
                      <span>Excellent</span>
                    </div>
                  }
                  
            </div>
          </div>
          ))}
        </>
      )}
    </div>  
  )
}

export default FeaturedProperties