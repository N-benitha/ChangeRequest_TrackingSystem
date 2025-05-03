import React from 'react'
import './DeveloperDash.css'
import { Link, Outlet } from 'react-router-dom'

const DeveloperDash = () => {

  return (
    <div className='devdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects / My_first_project</p>
          <button className='btn-1'>Dia</button>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Projects</Link>
              <Link to={'./change-requests-history'}>Change Request History</Link>
              <Link to={'./actions'}>Actions</Link>
          </div>
          <hr />
        </div>

      </div>
      <div className="devdash-subcontainer">
        <Outlet/>
      </div>
    </div>
  )
}

export default DeveloperDash