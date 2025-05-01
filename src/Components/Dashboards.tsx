import React from 'react'
import { Outlet } from 'react-router-dom'
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
        <div className="dash-box2">
            <div className="box-head">
                <p>Projects / My_first_project</p>
                <button className='btn-1'>Dia</button>
            </div>
            
            <div className="box-titles">
                <div className="titles">
                    <span>Projects</span>
                    <span>CR History</span>
                    <span>Actions</span>
                </div>
                <hr />
            </div>


            <Outlet />
        </div>
    </div>
  )
}

export default Dashboards