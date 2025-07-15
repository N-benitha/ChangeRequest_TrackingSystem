import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import './Dashboards.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import api from '../api/axios';

/**
 * Dashboards component responsible for rendering the dashboard navigation and layout
 * based on the current user's type. Fetches the current user information on mount
 * and conditionally displays navigation links for ADMIN, APPROVER, and DEVELOPER user types.
 * Shows a loading indicator while fetching user data and a message for users without navigation access.
 *
 * @component
 *
 * @returns The rendered dashboard layout with navigation links appropriate to the user type.
 *
 */
const Dashboards = () => {
  interface User {
    id: string;
    username: string;
    email: string;
    user_type: string;
    status: string;
  }

  const [userType, setUserType] = useState<string>('USER');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user information to determine which navigation to show
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userInfo = await api.get('/auth/me');
        const currentUser = userInfo.data.user;
        
        if (currentUser?.user_type) {
          setUserType(currentUser.user_type.toUpperCase());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUserType('USER');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Don't render anything while loading user data
  if (loading) {
    return (
      <div className="dash-container">
        <div className="dash-box1">
          <div className="loading">Loading...</div>
        </div>
        <Outlet />
      </div>
    );
  }

  return (
    <div className="dash-container">
      <div className="dash-box1">
        <div className="close">
          <FontAwesomeIcon icon={faXmark}/>
        </div>
        <h2>{userType}</h2>
        
        {/* Navigation components for ADMIN users */}
        {userType === 'ADMIN' && (
          <div className="dash-components">
            <div className="comp1">
              <Link to={'./admin'}>Users</Link>
            </div>
            <div className="comp1">
              <Link to={'./admin/all-projects'}>Projects</Link>
            </div>
            <div className="comp1">
              <Link to={'./reports'}>Reports</Link>
            </div>
          </div>
        )}

        {/* Navigation for other user types */}
        {userType === 'APPROVER' && (
          <div className="dash-components">
            {/* <div className="comp1">
              <Link to={'./approver'}>Approvals</Link>
            </div>
            <div className="comp1">
              <Link to={'./reports'}>Reports</Link>
            </div> */}
          </div>
        )}

        {userType === 'DEVELOPER' && (
          <div className="dash-components">
            {/* <div className="comp1">
              <Link to={'./developer'}>My Requests</Link>
            </div>
            <div className="comp1">
              <Link to={'./developer/projects'}>Projects</Link>
            </div> */}
          </div>
        )}

        {/* Message for users without navigation access */}
        {!['ADMIN', 'APPROVER', 'DEVELOPER'].includes(userType) && (
          <div className="no-access">
            <p>No navigation available for your user type.</p>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  )
}

export default Dashboards