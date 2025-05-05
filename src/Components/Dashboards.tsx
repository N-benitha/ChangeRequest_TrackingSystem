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
                <div className="comp1">Users</div>
                <div className="comp1"><Link to={'./admin/all-projects'} >Projects</Link></div>
                <div className="comp1">Reports</div>
            </div>
        </div>
        <Outlet />
    </div>
  )
}

export default Dashboards