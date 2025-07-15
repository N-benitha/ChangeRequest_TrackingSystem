import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './ApproverDash.css'
import api from '../api/axios';

/**
 * ApproverDash component displays the dashboard for users with approver privileges.
 * 
 * - Provides navigation between different change request status views (Pending, Approved, Rolled back)
 * - Displays current user information and logout functionality
 * - Serves as a layout component with nested routing for approver-specific views
 * - Handles user authentication state and redirects on logout
 * 
 * @component
 * @returns The rendered Approver dashboard component.
 */
const ApproverDash = () => {

  interface User {
      id: string;
      username: string;
      email: string,
      password: string,
      user_type?: string;
      status?: string;
    }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Controls visibility of logout dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch current user information on component mount to display in header
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

  /**
   * Toggle the logout dropdown menu visibility
   */
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  /**
   * Handle user logout - clear session and redirect to login page
   */
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
          <p>Change Requests</p>
          <div className='box-logout'>
            <button className='btn-1' onClick={handleDropdownToggle}>{user?.username}</button>
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