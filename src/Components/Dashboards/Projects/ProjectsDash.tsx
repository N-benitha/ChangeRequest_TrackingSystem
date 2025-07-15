import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
import './css/ProjectsDash.css'
import api from '../../../api/axios'

/**
 * ProjectsDash component serves as the main dashboard for managing and viewing projects.
 * 
 * - Fetches and displays the current authenticated user's information.
 * - Handles project selection and navigation based on the current route and project ID.
 * - Provides navigation links for projects and project information.
 * - Manages user logout and dropdown menu for user actions.
 * - Handles loading and error states for user and project data fetching.
 * 
 * @component
 * @returns The rendered ProjectsDash component with navigation and outlet for nested routes.
 */
const ProjectsDash = () => {
  interface Project {
    id: string;
    title: string;
    description: string;
  }
  interface User {
    id: string;
    username: string;
    email: string,
    password: string,
    user_type?: string;
    status?: string;
  }

  const [project, setProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {id: projectId} = useParams();

  // Fetch user data
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
   * Handle project-specific routing and data fetching
   * Manages route validation and project data loading based on URL parameters
   */
  useEffect(() => {
    // Check if current route needs a project ID
    const routesThatNeedProjectId = ['project-info', 'project-update'];
    const currentPath = location.pathname;
    const needsProjectId = routesThatNeedProjectId.some(route => currentPath.includes(route));

    console.log('Current path:', currentPath);
    console.log('Project ID:', projectId);
    console.log('Needs project ID:', needsProjectId);

    // Only redirect if we're on a route that requires a project ID but don't have one
    if (needsProjectId && !projectId) {
      console.log('Redirecting because route needs project ID but none provided');
      setProject(null);
      setProjectTitle('');
      setError('');
      navigate('./');
      return;
    }

    // If we have a project ID, fetch the project
    if (projectId) {
      const fetchProject = async () => {
        try {
          const response = await api.get(`/project/${projectId}`);
          setProject(response.data);
          setProjectTitle(response.data.title);
          setError('');
        } catch (error) {
          setError("Failed to fetch project");
          console.log(error);
          // Navigate back to projects list on fetch failure
          navigate('./');
        }
      };

      fetchProject();
    } else {
      // Clear project state when no project ID is present
      setProject(null);
      setProjectTitle('');
    }
  }, [projectId, navigate, location.pathname]);
  
  /**
   * Toggle user dropdown menu visibility
   */
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  /**
   * Handle user logout process
   * Calls logout API and redirects to login page
   */
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Handle navigation back to projects list
   * Clears project-specific state and navigates to projects overview
   */
  const handleProjectsNavigation = () => {
    setProject(null);
    setProjectTitle('');
    navigate('./');
  };
  
  return (
    <div className='projectsdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects {project ? <span>/ {projectTitle}</span> : ''}</p>
          <div className='box-logout'>
            <button className='btn-1' onClick={handleDropdownToggle}>{user?.username}</button>
            <span className={`logout-dropdown ${isDropdownOpen ? 'show': ''}`} onClick={handleLogout}>Log out</span>
          </div>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'} onClick={handleProjectsNavigation}>Projects</Link>
              {/* Project Information tab only shows when a project is selected */}
              {project && (
                <Link to={'./project-info'}>Project Information</Link>
              )}
          </div>
          <hr />
        </div>

      </div>
      <div className="projectsdash-subcontainer">
        <Outlet/>
      </div>
    </div>
  )
}

export default ProjectsDash