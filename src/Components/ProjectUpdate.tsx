import React, { useEffect, useState } from 'react'
import './ProjectUpdate.css'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProjectUpdate = () => {
    interface Project {
        id: string;
        title: string;
        description: string;
    }
    const [project, setProject] = useState<Project | null>();
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const projectId = new URLSearchParams(window.location.search).get('id');

        if (!projectId) {
            setError("Project doesn't exist");
            return;
        }

        const fetchProject = async () => {
            try {
                const response = await api.get(`http://localhost:3000/project/${projectId}`);
                setProject(response.data);
                setProjectTitle(response.data.title);
                setProjectDescription(response.data.description);
                setLoading(false);
            } catch (error) {
                setError(error);
            }
        };

        fetchProject();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(
            `http://localhost:3000/project/${project?.id}`,
            {
                title: projectTitle,
                description: projectDescription
            });
            navigate('../');
            
            alert('Changes saved!');
            console.log('Project Updated');

        } catch (error) {
            setError(error);
            console.log('Failed to update project', error);
            
        }
    }

    if (loading) <div>Loading...</div>

  return (
    <div className="project-container">
      <form onSubmit={handleSubmit}>
        <h2>Project Information</h2>
        <div className="form-content">
          <div className="form-content-item">
            <p>Title: <strong style={{color: 'white', paddingLeft: '10px'}}> {projectTitle}</strong></p>
            <input type="text" className='project-text' placeholder='New Project Title' onChange={(e) => setProjectTitle(e.target.value)}/>
          </div>

          <div className="form-content-item">
            <p>Description</p>
            <textarea name="description" className='project-text' value={projectDescription} cols={60} rows={5} onChange={(e) => setProjectDescription(e.target.value)}/>
          </div>

          <button type="submit" className='btn-1'>Save Changes</button>

        </div>          

      </form>

    </div>
  )
}

export default ProjectUpdate