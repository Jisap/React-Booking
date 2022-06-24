import React from 'react'
import "./mailList.css"

const MailList = () => {
  return (
      // width:100% mt:50px dp:flex fd:column aic bg:blue
    <div className="mail">
      <h1 className="mailTitle">Save time, save money!</h1>
      <span className="mailDesc">Sign up and we'll send the best deals to you</span>
      <div className="mailInputContainer">
        <input type="text" placeholder="Your Email" />
        <button>Subscribe</button>
      </div>
    </div>
  )
}

export default MailList