import React, { useEffect, useState } from 'react'
import './UserProjects.css'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const UserProjects = () => {
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
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { projectId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await api.get(`http://localhost:3000/auth/me`);
        setUser(userInfo.data.user);
        const userId = user?.id;
        if (!userId) throw new Error("User ID not found");

        const [userProjectRes, changeRequestRes] = await Promise.all([
          api.get(`http://localhost:3000/user-project/by-user/${userId}`),
          api.get(`http://localhost:3000/change-request/query?userId=${userId}`)
        ]);
        setUserProjects(userProjectRes.data);
        setChangeRequests(changeRequestRes.data);
        setLoading(false);

      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error fetching:", error);
        
      }
    };
  
    fetchUser();
  
  }, []);

  useEffect(() => {
    if (!projectId) return;

    const fetchChangeRequests = async () => {
      try {    
        const response =  await api.get(`http://localhost:3000/change-request/query?projectId=${projectId}`);
        setChangeRequests(response.data);
        setLoading(false);

      } catch (error) {
        setError("Failed to fetch change requests");
        console.error("Error fetching:", error);
      }
    };

    fetchChangeRequests();
  
  }, [navigate]);


  return (
    <>
      <span className='project-count'>10 projects</span>
      <div className="content">
          <div className="project">              
            <div className="project-name">New Feature: Voice Assistant</div>
            <div className="project-description">
              <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
              <button className='btn-status'>Request Approval</button>
            </div>
          </div>
      </div>

      <div className="content">
          <div className="project">              
            <div className="project-name">New Feature: Voice Assistant</div>
            <div className="project-description">
              <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
              <button className='btn-status'>Request Approval</button>
            </div>
          </div>
      </div>

      <div className="content">
          <div className="project">              
            <div className="project-name">New Feature: Voice Assistant</div>
            <div className="project-description">
              <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
              <button className='btn-status'>Request Approval</button>
            </div>
          </div>
      </div>
    </>
  )
}

export default UserProjects