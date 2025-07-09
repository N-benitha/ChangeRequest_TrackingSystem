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
  
  interface ChangeRequest {
    id: string;
    description: string;
    project: Project;
    user: User;
    request_type: string;
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { projectId } = useParams();


  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {      
        const response = await api.get(`http://localhost:3000/project/${projectId}`);
        setProject(response.data);
      } catch (error) {
      setError("Failed to fetch project data");
      console.error("Error fetching:", error);
      }
    };
    fetchProject();

  }, [navigate, projectId]);
  
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

  // if (loading) return <span>Loading...</span>;

  return (
    <div className='devdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects {project ? <span>/ {project.title}</span>: ''}</p>
          <div className='box-logout'>
            <button className='btn-1' onClick={handleDropdownToggle}>Dia</button>
            <span className={`logout-dropdown ${isDropdownOpen ? 'show': ''}`} onClick={handleLogout}>Log out</span>
          </div>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Projects</Link>
              <Link to={'./change-requests-history/:id'}>Change Request History</Link>
              <Link to={'./actions/:id'}>Actions</Link>
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