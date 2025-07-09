import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './ApproverDash.css'
import api from '../api/axios';

const ApproverDash = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='approverdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects / My_first_project</p>
          <div className='box-logout'>
            <button className='btn-1' onClick={handleDropdownToggle}>Dia</button>
            <span className={`logout-dropdown ${isDropdownOpen ? 'show': ''}`} onClick={handleLogout}>Log out</span>
          </div>
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