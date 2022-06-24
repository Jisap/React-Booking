import React from 'react';
import "./searchItem.css";
import { Link } from 'react-router-dom';

const Searchitem = ({ item }) => {
  return (
    // dp:flex jc:space-between  border: 1px solid lightgray;
    <div className="searchItem">
      <img
        src={ item.photos[0] }
        alt=""
        className="siImg" // width: 200px height: 200px
      />

      {/* dp: flex fd: column flex:2 */}
      <div className="siDesc">
        <h1 className="siTitle">{ item.name }</h1>
        <span className="siDistance">{ item.distance } from center</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="siFeatures">
          { item.desc }
        </span>
        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>

      {/* dp:flex flex: 1 fd: column jc:space-between*/}
      <div className="siDetails">
        {/* dp:flex jc:space-between */}
        { item.rating && 
          <div className="siRating">
            <span>Excellent</span>
            <button>{ item.rating }</button>
          </div>
        }
        {/* text-alig:rigth dp:flex fd:column */}
        <div className="siDetailTexts">
          <span className="siPrice">${ item.cheapestPrice }</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/hotels/${item._id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>

    </div>

    
  )
}

export default Searchitem