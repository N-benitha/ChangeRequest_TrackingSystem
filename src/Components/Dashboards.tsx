import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import './Dashboards.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'


const Dashboards = () => {

  return (
    <div className="dash-container">
        <div className="dash-box1">
            <div className="close">
                <FontAwesomeIcon icon={faXmark}/>
            </div>
            <h2>DEVELOPER</h2>
            <div className="dash-components">
                <div className="comp1">Your Projects</div>
                <div className="comp1">Explore New Projects</div>
            </div>
        </div>
        <Outlet />
    </div>
  )
}

export default Dashboards