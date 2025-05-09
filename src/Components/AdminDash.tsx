import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './AdminDash.css'

const AdminDash = () => {
  return (
    <div className='admindash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Users / Carl Johnson</p>
          <button className='btn-1'>Dia</button>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Users</Link>
              <Link to={'./user-info'}>User Information</Link>
              <Link to={'./assign-projects'}>Projects</Link>
          </div>
          <hr />
        </div>

      </div>
      <div className="admindash-subcontainer">
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDash