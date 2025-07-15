import React, { useEffect, useState } from 'react'
import './UserProjects.css'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

/**
 * Displays a list of projects assigned to the currently authenticated user.
 *
 * Fetches user information and their associated projects from the API on mount.
 * Shows a loading state while fetching, and handles errors gracefully.
 * Allows navigation to project-specific change request history and approval actions.
 *
 * @component
 *
 * @returns The rendered list of user projects or a message if none are assigned.
 *
 */
const UserProjects = () => {
  interface Project {
    id: string;
    title: string;
    description: string;
  }
  
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user info to obtain userId
        const userInfo = await api.get(`/auth/me`);
        const userId = userInfo.data.user.id;
        console.log('User ID:', userId);
        
        if (!userId) throw new Error("User ID not found");

        // Fetch projects assigned to this user
        const userProjectRes = await api.get(`/user-project?userId=${userId}`);
        setUserProjects(userProjectRes.data);
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Navigate to change request history for a specific project
  const handleProject = async (id: string) => {
    navigate(`change-requests-history/${id}`);
  }

  // Navigate to approval actions page for a specific project
  const handleButton = async (id: string) => {
    navigate(`./actions/${id}`);
  }

  return (
    <>
      <span className='devdash-project-count'>{userProjects.length} projects</span>
      {userProjects.length > 0 ? (
        <div className="devdash-content">
          {userProjects.map((project, index) => (          
            <div className="devdash-project" key={project.id || index}>     
              {/* Project title - clickable to view change request history */}    
              <div className="devdash-project-name" onClick={() => handleProject(project.id)}>{project.title}</div>
              <div className="devdash-project-description">
                <span className='devdash-info'>{project.description} <span className='readmore'>Read more...</span></span>
                {/* Button to navigate to approval actions for this project */}
                <button className='devdash-btn-status' onClick={() => handleButton(project.id)}>Request Approval</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span>No projects assigned yet</span>
        )}      
    </>
  )
}

export default UserProjects