import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './css/AdminDash.css'
import api from '../../../api/axios'

/**
 * AdminDash component for the admin dashboard.
 *
 * This component handles:
 * - Fetching and displaying the current authenticated user's information.
 * - Fetching and displaying selected user details based on the URL query parameter 'id'.
 * - Providing navigation links for user management and project assignment.
 * - Handling user logout functionality.
 * - Displaying a dropdown for logout actions.
 *
 * State:
 * - 'users': The selected user's basic information (id, username) or null.
 * - 'user': The current authenticated user's full information or null.
 * - 'loading': Indicates if user data is being loaded.
 * - 'error': Stores error messages for failed fetches.
 * - 'isDropdownOpen': Controls the visibility of the logout dropdown.
 *
 * Side Effects:
 * - Fetches current user info on mount.
 * - Fetches selected user info when the URL query parameter `id` changes.
 *
 * @component
 * @returns The rendered AdminDash form component.
 */

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
      // Clear users state when no user is selected
      setUsers(null);
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
              {users && (
                <Link to={`./assign-projects/${users.id}`}>Projects</Link>
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