import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import './ProjectsDash.css'
import api from '../api/axios';

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

  const {id: projectId} = useParams();

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
    // const projectId = new URLSearchParams(window.location.search).get('id');

    if (!projectId) {
      setError("Project doesn't exist");
      return;
    }
    const fetchProject = async () => {
      try {
        const response = await api.get(`/project/${projectId}`);
        setProject(response.data);
        setProjectTitle(response.data.title)
      } catch (error) {
        setError("Failed to fetch user");
        console.log(error);
      }
    };

    fetchProject();
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
              <Link to={'./'}>Projects</Link>
              <Link to={'./project-info'}>Project Information</Link>
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