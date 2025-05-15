import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import './ProjectsDash.css'
import axios from 'axios';

const ProjectsDash = () => {
  interface Project {
    id: string;
    title: string;
    description: string;
  }
  const [project, setProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const projectId = new URLSearchParams(window.location.search).get('id');

    if (!projectId) {
      setError("Project doesn't exist");
      return;
    }
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/${projectId}`);
        setProject(response.data);
        setProjectTitle(response.data.title)
      } catch (error) {
        setError("Failed to fetch user");
        console.log(error);
      }
    };

    fetchProject();
  }, [navigate]);
  
  
  return (
    <div className='projectsdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects {project ? <span>/ {projectTitle}</span> : ''}</p>
          <button className='btn-1'>Dia</button>
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