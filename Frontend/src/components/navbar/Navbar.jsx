import React, { useContext } from 'react'
import './navbar.css'
import { Link } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext'

const Navbar = () => {

  const { user } = useContext(AuthContext)
  
  return (
          // dp:flex jcc
    <div className="navbar">
        {/* width:100% max-width:1024 dp:flex aic jc:space-between */}
        <div className="navContainer">
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            <span className="logo">Jisapbooking</span>
          </Link>
            { user ? user.username : (  // Si hay usuario logueado se muestra su nombre sino se muesran los botones login y register
              <div className="navItems">
                <button className="navButton">Register</button>
                <button className="navButton">Login</button>
              </div>
            )}
        </div> 
    </div>
  )
}

export default Navbar
