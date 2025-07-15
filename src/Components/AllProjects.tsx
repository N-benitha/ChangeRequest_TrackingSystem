import React, { useEffect, useState } from 'react'
import './AllProjects.css'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

/**
 * Displays a list of all projects, allowing users to view, add, update, or remove projects.
 *
 * - Fetches project data from the backend API on mount.
 * - Handles loading and error states.
 * - Allows navigation to add, update, and project detail pages.
 * - Provides UI controls for updating and removing individual projects.
 * 
 * @component
 * @returns The rendered list of projects with management controls.
 */
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

  // Fetch all projects when component mounts
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

  // Navigate to the add project form
  const handleAddProject = () => {
    try {
      console.log("Add Project button clicked!");
      navigate('./add-project');
      console.log("Navigation called successfully");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

   /**
   * Delete a project and update the local state
   * @param id - The project ID to delete
   */
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

  /**
   * Navigate to project details page
   * @param id - The project ID to view
   */
  const handleProjectTitle = (id: string) => {
    try {
      navigate(`./project-info/${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

   /**
   * Navigate to project update form
   * @param id - The project ID to update
   */
  const handleUpdate = (id: string) => {
    try {
      navigate(`./project-update/${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Show loading state while fetching data
  if (loading) return <div>Loading...</div>;

  // Show error state if fetch failed
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="box-body">
      <div className="add-project">
        <button className='btn-add-project' onClick={handleAddProject}>
          Add Project
        </button>
        <span className='project-count'>{projects.length} Projects</span>
      </div>

      {/* Projects list */}
      <div className="content">
        {projects.map((project) => (
          <div className="project" key={project.id}>
            <div className="project-name" onClick={() => handleProjectTitle(project.id)}>
              {project.title}
            </div>
            <div className="project-type">
              <span className='info'>{project.description}</span>
              {/* Action buttons for each project */}
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