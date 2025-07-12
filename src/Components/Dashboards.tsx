import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import './Dashboards.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import api from '../api/axios';

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
        
        {/* Only show navigation components for ADMIN users */}
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

        {/* Optional: Show different navigation for other user types */}
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

        {/* Show message for users without navigation access */}
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