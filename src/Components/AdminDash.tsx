import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './AdminDash.css'
import api from '../api/axios'

const AdminDash = () => {
  interface Users {
    id: string;
    username: string;
  }
  interface User {
    id: string;
    username: string;
    email: string,
    password: string,
    user_type?: string;
    status?: string;
  }

  const [users, setUsers] = useState<Users | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await api.get(`/auth/me`);
        const currentUser = userInfo.data.user;
        setUser(currentUser);
        console.log('User info:', currentUser);
        
        if (!currentUser) throw new Error("User not found");
      } catch (error) {
        setError("Failed to fetch user info");
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('id');

    if (!userId) {
      setError("user doesn't exist");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUsers(response.data)
      } catch (error) {
        setError("Failed to fetch user");
        console.log(error);
      }
    };

    fetchUsers();
  }, [navigate]);

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
    <div className='admindash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Users {users ? <span>/ {users.username}</span> : ''}</p>
          <div className='box-logout'>
            <button className='btn-1' onClick={handleDropdownToggle}>{user?.username}</button>
            <span className={`logout-dropdown ${isDropdownOpen ? 'show': ''}`} onClick={handleLogout}>Log out</span>
          </div>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Users</Link>
              <Link to={'./user-info'}>User Information</Link>
              {users ? (
                <Link to={`./assign-projects/${users.id}`}>Projects</Link>
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