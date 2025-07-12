import React, { useEffect, useState } from 'react'
import './AllProjects.css'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AllProjects = () => {
  interface Project {
    id: string;
    title: string;
    description: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/project/all-projects');
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    try {
      console.log("Add Project button clicked!");
      navigate('./add-project');
      console.log("Navigation called successfully");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/project/${id}`);
      console.log('Project deleted');
      setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
      setError("Failed to delete project");
    }
  };

  const handleProjectTitle = (id: string) => {
    try {
      navigate(`./project-info/${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleUpdate = (id: string) => {
    try {
      navigate(`./project-update/${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="box-body">
      <div className="add-project">
        <button className='btn-add-project' onClick={handleAddProject}>
          Add Project
        </button>
        <span className='project-count'>{projects.length} Projects</span>
      </div>

      <div className="content">
        {projects.map((project) => (
          <div className="project" key={project.id}>
            <div className="project-name" onClick={() => handleProjectTitle(project.id)}>
              {project.title}
            </div>
            <div className="project-type">
              <span className='info'>{project.description}</span>
              <div className="btns">
                <button className='btn-update' onClick={() => handleUpdate(project.id)}>
                  Update
                </button>
                <button className='btn-remove' onClick={() => handleRemove(project.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;