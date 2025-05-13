import React, { useEffect, useState } from 'react'
import './AllProjects.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllProjects = () => {
  interface Project {
    id: string,
    title: string,
    description: string
  }
  interface handleProjectTitle {
    (id: string): void
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/project/all-projects`);
        setProjects(response.data.projects);

      } catch (error) {
        setError(error);
      console.error(error);

      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>

  const handleAddProject = () => {
    navigate('add-project')
  }

  const handleRemove = async (id: string) => {
        try {
          await axios.delete(`http://localhost:3000/project/${id}`);
          console.log('Project deleted');

          setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));

        } catch (error) {
          setError(error);
          console.log(error);
          
        }
        
    }
    const handleProjectTitle: handleProjectTitle = (id) => {
        navigate(`./user-info/?id=${id}`)
    }

  return (
    <div className="box-body">
        <div className="add-project">
            <button className='btn-add-project' onClick={handleAddProject}>Add Project</button>
            <span className='project-count'>{projects.length} Projects</span>
        </div>

        <div className="content">
          {projects.map((project, index) => (
            <div className="project" key={project.id}>
            <div className="project-name" onClick={() => handleProjectTitle(project.id)}>{project.title}</div>
            <div className="project-type">
              <span className='info'>{project.description}</span>
              <button className='btn-remove' onClick={() => handleRemove(project.id)}>Remove</button>
            </div>
            </div>
          ))}
            
        </div>
        
    </div>
  )
}

export default AllProjects