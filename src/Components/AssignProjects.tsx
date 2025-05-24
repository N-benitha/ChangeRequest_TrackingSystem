import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './AssignProjects.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'

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
  const [newProject, setNewProject] = useState('');
  const [oldProject, setOldProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: userId} = useParams();

  useEffect(() => {

    if (!userId) {
      setError("User doesn't exist");
      setLoading(false);
      return;
    }
    setId(userId);

    const fetchData = async () => {
      try {
        const [userRes, userProjectRes, allProjectsRes] = await Promise.all([
          axios.get(`http://localhost:3000/auth/${userId}`),
          // axios.get(`http://localhost:3000/user-project/by-user/${userId}`),
          axios.get(`http://localhost:3000/change-request/query?userId=${userId}`),
          axios.get(`http://localhost:3000/project/all-projects`)
        ]);
        setUser(userRes.data);

        console.log("Change requests response:", userProjectRes.data);
        setChangeRequests(userProjectRes.data || []);
        setUserProjects(userProjectRes.data.project || []);
        
        setAllProjects(allProjectsRes.data.projects);
        // setUserName(response.data.username);
        // setUserType(response.data.user_type);
        // setUserStatus(response.data.status);

      } catch (error) {
        console.log("Error fetching data", error);
        setError("Failed to load user or projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleAssign = async (e) => {
    e.preventDefault();
    const foundProject = allProjects.find(p => p.title === newProject);

    if (!foundProject) {
      setError("Project not found");
      return;
    }
    try {
      await axios.post(`http://localhost:3000/user-project`, {
        userId: id,
        projectId: foundProject.id
      });

      alert(`Project '${foundProject.title}' assigned successfully!`);
      setNewProject('');

      //refresh user's projects
      const res = await axios.get(`http://localhost:3000/user-project/by-user/${id}`);
      setUserProjects(res.data || []);

    } catch (error) {
      console.log("Failed to assign project", error);
      setError("Failed to assign project");
      
    }
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    
    const foundProject = allProjects.find(p => p.title === oldProject);

    if (!foundProject) {
      setError("Project not found for revoking");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/user-project`, {
        data: {
          userId: id,
          projectId: foundProject.id
        }
      });
      alert(`Project '${foundProject.title}' revoked successfully!`);
      setOldProject('');

      // refresh user's projects
      const res = await axios.get(`http://localhost:3000/user-project/by-user/${id}`);
      setUserProjects(res.data.project);

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
      <div className="user-projects">
        <h3>Projects</h3>
        <div className="project-content">
          {changeRequests.length > 0 ? changeRequests.map((changeRequest, index) => (
            <div className="project-items" key={changeRequest.id || index}>
              <div className='item1'>
                <div className='title'>
                  <span className='title-text'>{changeRequest.project.title}:</span>
                  <span className='title-description'> {changeRequest.request_type} - {changeRequest.description}</span>
                </div>
                <div className="description">{changeRequest.project.description} </div>
                <span className='date'>authored on {changeRequest.updated_at}</span>
              </div>
              <button className={`btn-status ${changeRequest.status}`}>{changeRequest.status}</button>
          </div>
          ))
          : <span>No projects assigned</span> }
        </div>
      </div>
      
      <form onSubmit={handleAssign}>
        <div className="project-item">
          <p>Assign New Project:</p>
          <select className='project-text' value={newProject} onChange={(e) => setNewProject(e.target.value)}>
            <option value="">Select a project</option>
            {allProjects.map(project => (
              <option key={project.id} value={project.title}>{project.title}</option>
            ))}
          </select>
          <button className='btn-save' type='submit'>Assign Project</button>
        </div>
      </form>
      
      <form onSubmit={handleRevoke}>
        <div className="project-item">
          <p>Revoke Project:</p>
          <select className='project-text' value={oldProject} onChange={(e) => setOldProject(e.target.value)}>
            <option value="">Select a project</option>
            {allProjects.map(project => (
              <option key={project.id} value={project.title}>{project.title}</option>
            ))}
          </select>
          <button className='btn-save' type='submit'>Revoke Project</button>
        </div>
      </form>
    </div>
  )
}

export default AssignProjects