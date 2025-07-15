import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './css/AssignProjects.css'
import { useParams } from 'react-router-dom'
import api from '../../../api/axios'

/**
 * AssignProjects is a React functional component for managing project assignments for a specific user.
 * 
 * - Displays user's change requests and currently assigned projects
 * - Allows admins to assign new projects to the user from available projects
 * - Allows admins to revoke projects currently assigned to the user
 * - Filters projects intelligently to prevent duplicate assignments
 * - Refreshes data after assignment/revocation operations
 * 
 * @component
 * @returns The rendered AssignProjects component UI.
 */
const AssignProjects = () => {
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

  const [user, setUser] = useState<User | null>(null);
  const [id, setId] = useState('');
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  // Form state for project assignment
  const [newProject, setNewProject] = useState('');
  // Form state for project revocation
  const [oldProject, setOldProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: userId} = useParams();

  // Fetch all necessary data when component mounts or userId changes
  useEffect(() => {
    if (!userId) {
      setError("User doesn't exist");
      setLoading(false);
      return;
    }
    setId(userId);

    const fetchData = async () => {
      try {
        const [userRes, userProjectRes, changeRequestRes, allProjectsRes] = await Promise.all([
          api.get(`/users/${userId}`), // Get user details
          api.get(`/user-project?userId=${userId}`),  // Get user's assigned projects
          api.get(`/change-request/query?userId=${userId}`), // Get user's change requests
          api.get(`/project/all-projects`) // Get all available projects
        ]);
        
        setUser(userRes.data);

        // Handle user projects
        console.log("User projects response:", userProjectRes.data);
        setUserProjects(userProjectRes.data || []);
        
        // Handle change requests
        console.log("Change requests response:", changeRequestRes.data);
        setChangeRequests(changeRequestRes.data || []);
        
        setAllProjects(allProjectsRes.data.projects);

      } catch (error) {
        console.log("Error fetching data", error);
        setError("Failed to load user or projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Filter projects for assignment (projects NOT assigned to user)
  const availableProjectsToAssign = allProjects.filter(project => 
    !userProjects.some(userProject => userProject.id === project.id)
  );

  // Filter projects for revocation (projects assigned to user)
  const assignedProjectsToRevoke = userProjects;

  /**
   * Handle assigning a new project to the user
   * @param e - Form submission event
   */
  const handleAssign = async (e) => {
    e.preventDefault();
    const foundProject = allProjects.find(p => p.title === newProject);

    if (!foundProject) {
      setError("Project not found");
      return;
    }
    
    try {
      await api.post(`/user-project`, {
        userId: id,
        projectId: foundProject.id
      });

      alert(`Project '${foundProject.title}' assigned successfully!`);
      setNewProject(''); // Clear form

      // Refresh user's projects
      const res = await api.get(`/user-project?userId=${userId}`);
      setUserProjects(res.data || []);

    } catch (error) {
      console.log("Failed to assign project", error);
      setError("Failed to assign project");
    }
  };

  /**
   * Handle revoking a project from the user
   * @param e - Form submission event
   */
  const handleRevoke = async (e) => {
    e.preventDefault();
    
    // Find project in user's assigned projects (not all projects)
    const foundProject = userProjects.find(p => p.title === oldProject);

    if (!foundProject) {
      setError("Project not found for revoking");
      return;
    }

    try {
      await api.delete(`/user-project`, {
        data: {
          userId: id,
          projectId: foundProject.id
        }
      });
      
      alert(`Project '${foundProject.title}' revoked successfully!`);
      setOldProject('');

      // Refresh user's projects
      const res = await api.get(`/user-project?userId=${userId}`);
      setUserProjects(res.data || []);

    } catch (error) {
      console.log("Failed to revoke project", error);
      setError("Failed to revoke project");
    }
  };

  if (loading) return <span>Loading...</span>

  if (error) return <span className='error'>{error}</span>

  return (
    <div className='assign-container'>
      <div className="username">{user?.username}</div>
      
      {/* User's change requests history */}
      <div className="user-projects">
        <h3>Change Requests</h3>
        <div className="project-content">
          {changeRequests.length > 0 ? changeRequests.map((changeRequest, index) => (
            <div className="project-items" key={changeRequest.id || index}>
              <div className='item1'>
                <div className='title'>
                  <span className='title-text'>{changeRequest.project.title}:</span>
                  <span className='title-description'> {changeRequest.request_type} - {changeRequest.description}</span>
                </div>
                <div className="description">{changeRequest.project.description}</div>
                <span className='date'>authored on {changeRequest.updated_at}</span>
              </div>
              <button className={`btn-status ${changeRequest.status}`}>{changeRequest.status}</button>
            </div>
          ))
          : <span>No change requests made yet.</span> }
        </div>
      </div>

      {/* Show assigned projects */}
      <div className="user-projects">
        <h3>Assigned Projects</h3>
        <div className="project-content">
          {userProjects.length > 0 ? userProjects.map((project, index) => (
            <div className="project-items" key={project.id || index}>
              <div className='item1'>
                <div className='title'>
                  <span className='title-text'>{project.title}</span>
                </div>
                <div className="description">{project.description}</div>
              </div>
            </div>
          ))
          : <span>No projects assigned yet.</span> }
        </div>
      </div>
      
      {/* Assign new projects - only show unassigned projects */}
      <form onSubmit={handleAssign}>
        <div className="project-item">
          <p>Assign New Project:</p>
          <select className='project-text' value={newProject} onChange={(e) => setNewProject(e.target.value)}>
            <option value="">Select a project</option>
            {availableProjectsToAssign.map(project => (
              <option key={project.id} value={project.title}>{project.title}</option>
            ))}
          </select>
          <button className='btn-save' type='submit' disabled={!newProject}>
            Assign Project
          </button>
        </div>
      </form>
      
      {/* Revoke projects - only show assigned projects */}
      <form onSubmit={handleRevoke}>
        <div className="project-item">
          <p>Revoke Project:</p>
          <select className='project-text' value={oldProject} onChange={(e) => setOldProject(e.target.value)}>
            <option value="">Select a project</option>
            {assignedProjectsToRevoke.map(project => (
              <option key={project.id} value={project.title}>{project.title}</option>
            ))}
          </select>
          <button className='btn-save' type='submit' disabled={!oldProject}>
            Revoke Project
          </button>
        </div>
      </form>
    </div>
  )
}

export default AssignProjects