import React, { useEffect, useState } from 'react'
import './DeveloperDash.css'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import api from '../api/axios';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { id: projectId } = useParams();

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
    if (!projectId) {
      setProject(null);
      setError('');
      
      navigate('./');
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await api.get(`/project/${projectId}`);
        setProject(response.data);
        setError('');
      } catch (error) {
        setError("Failed to fetch project data");
        console.error("Error fetching:", error);
        
        navigate('./');
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
      <div className="devdash-subcontainer">
        <Outlet/>
      </div>
    </div>
  )
}

export default DeveloperDash