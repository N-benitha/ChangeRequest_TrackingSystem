import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './AdminDash.css'
import axios from 'axios'

const AdminDash = () => {
  interface User {
    id: string;
    username: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('id');

    if (!userId) {
      setError("user doesn't exist");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/${userId}`);
        setUser(response.data)
      } catch (error) {
        setError("Failed to fetch user");
        console.log(error);
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className='admindash-container'>
      <div className="dash-box2">
        <div className="box-head">
        <p>Users {user ? <span>/ {user.username}</span> : ''}</p>
          <button className='btn-1'>Dia</button>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Users</Link>
              <Link to={'./user-info'}>User Information</Link>
              {user ? (
                <Link to={`./assign-projects/${user.id}`}>Projects</Link>
              ) : (
                <Link to={`./assign-projects`}>Projects</Link>
              )}
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