import React, { useEffect, useState } from 'react'
import './UserProjects.css'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

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

  const { projectId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await api.get(`/auth/me`);
        const userId = userInfo.data.user.id;
        console.log('User ID:', userId);
        
        if (!userId) throw new Error("User ID not found");

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

  const handleProject = async (id: string) => {
    navigate(`change-requests-history/${id}`);
  }
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
              <div className="devdash-project-name" onClick={() => handleProject(project.id)}>{project.title}</div>
              <div className="devdash-project-description">
                <span className='devdash-info'>{project.description} <span className='readmore'>Read more...</span></span>
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