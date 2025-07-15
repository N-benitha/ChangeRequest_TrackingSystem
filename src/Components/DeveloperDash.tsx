import React, { useEffect, useState } from 'react'
import './DeveloperDash.css'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import api from '../api/axios';

/**
 * DeveloperDash component serves as the main dashboard for developers.
 * 
 * - Fetches and displays the current user's information.
 * - Fetches and displays project details based on the route parameter.
 * - Provides navigation between projects, change request history, and actions.
 * - Handles user logout and dropdown menu for user actions.
 * - Displays loading and error states as appropriate.
 * 
 * @component
 * @returns The rendered developer dashboard UI.
 */
const DeveloperDash = () => {
  interface User {
    id: string;
    username: string;
    email: string,
    password: string,
    user_type?: string;
    status?: string;
  }

  interface Project {
    id: string;
    title: string;
    description: string;
  }

  const [project, setProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   // Controls visibility of user dropdown menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { id: projectId } = useParams();

  // Fetch authenticated user information on component mount
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

  // Handle project-specific navigation and data fetching
  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setError('');
      
      // Redirect to projects list
      navigate('./');
      return;
    }

    // Fetch project details when a projectId is present
    const fetchProject = async () => {
      try {
        const response = await api.get(`/project/${projectId}`);
        setProject(response.data);
        setError(''); // Clear any previous errors
      } catch (error) {
        setError("Failed to fetch project data");
        console.error("Error fetching:", error);
        
        // Redirect back to projects list if project fetch fails
        navigate('./');
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  /**
   * Toggle the visibility of the user dropdown menu
   */
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  /**
   * Handle user logout - clear session and redirect to login
   */
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Handle navigation back to projects list - clears current project state
   */
  const handleProjectsNavigation = () => {
    setProject(null);
    navigate('./');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className='devdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects {project ? <span>/ {project.title}</span> : ''}</p>
          <div className='box-logout'>
            <button className='btn-1' onClick={handleDropdownToggle}>{user?.username}</button>
            <span className={`logout-dropdown ${isDropdownOpen ? 'show': ''}`} onClick={handleLogout}>Log out</span>
          </div>
        </div>
        
        <div className="box-titles">
          <div className="titles">
            <Link to={'./'} onClick={handleProjectsNavigation}>Projects</Link>
            {/* Project-specific navigation only appears when a project is selected */}
            {project && (
              <>
                <Link to={`./change-requests-history/${project.id}`}>Change Request History</Link>
                <Link to={`./actions/${project.id}`}>Actions</Link>
              </>
            )}
          </div>
          <hr />
        </div>
      </div>
       {/* Render nested route components (Projects list, Change Request History, Actions) */}
      <div className="devdash-subcontainer">
        <Outlet/>
      </div>
    </div>
  )
}

export default DeveloperDash