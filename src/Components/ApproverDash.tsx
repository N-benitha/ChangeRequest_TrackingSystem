import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './ApproverDash.css'

const ApproverDash = () => {
  return (
    <div className='approverdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects / My_first_project</p>
          <button className='btn-1'>Dia</button>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Pending</Link>
              <Link to={'./approved'}>Approved</Link>
              <Link to={'./rolled-back'}>Rolled back</Link>
          </div>
          <hr />
        </div>

      </div>
      <div className="approverdash-subcontainer">
        <Outlet/>
      </div>
    </div>
  )
}

export default ApproverDash