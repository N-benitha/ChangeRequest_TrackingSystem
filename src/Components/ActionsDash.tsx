import React, { useEffect, useState } from 'react'
import './ActionsDash.css'
import api from '../api/axios';
import { useParams } from 'react-router-dom';

const ActionsDash = () => {
  interface User {
    id: string;
    username: string;
    email: string,
    password: string,
    user_type?: string;
    status?: string;
  }

  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState('');
  const [deploymentDate, setDeploymentDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { id: projectId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await api.get(`/auth/me`);
        const currentUser = userInfo.data.user;

        if (!currentUser?.id) throw new Error("User ID not found");
        setUserId(currentUser.id);
        setUser(currentUser);

        if (!projectId) throw new Error("Project ID not found in URL");

        console.log(`User: ${currentUser.id}, Project: ${projectId}`);
      } catch (error) {
        setError(`Failed to fetch request info: ${error.message}`);
        console.error("Error fetching:", error);
      }
    }
    fetchData();
  }, [projectId]);
  
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    
    if (!requestType) {
      setError("Request type is required");
      return;
    }
    
    if (!deploymentDate) {
      setError("Deployment date is required");
      return;
    }

    if (!userId) {
      setError("User not authenticated");
      return;
    }

    if (!projectId) {
      setError("Project ID is missing");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const payload = {
        description: description,
        user: userId,
        project: projectId,
        request_type: requestType,
        deployment_date: deploymentDate
      };
      console.log('Sending payload:', payload);
      
      await api.post(`/change-request/create`, payload);
      console.log("Request sent successfully");

      alert(`Request '${requestType}' sent successfully`);

      // Clear form
      setDescription('');
      setRequestType('');
      setDeploymentDate('');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send request";
      setError(errorMessage);
      console.error("Error sending request:", error);        
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="action-container">
        {/* <button className='btn-add-request'>ADD REQUEST</button> */}

        {error && (
          <div className="error-message" style={{color: 'red', margin: '10px 0'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleRequest}>
          <h2>New Request</h2>
          <div className="form-content">
            {/* <div className="form-content-item">
              <p>Title</p>
              <input type="text" name="" id="" className='title' value="title"/>
            </div> */}

            <div className="form-content-item">
              <p>Request Type</p>
              <select name='change-type' id='change-type' className='change-type' value={requestType} onChange={(e) => setRequestType(e.target.value)} required>
                <option value="">Select request type</option>
                <option value="new-feature">New Feature</option>
                <option value="edited_feature">Edited Feature</option>
                <option value="bug_fix">Bug Fix</option>
                <option value="updates">Updates</option>
              </select>
            </div>

            <div className="form-content-item">
              <p>Description</p>
              <textarea 
                name="description" 
                className="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                cols={60} 
                rows={5} 
                placeholder='Describe your change request...'
                required
                ></textarea>
            </div>

            <div className="form-content-item">
              <p>Deployment date</p>
              <input 
                type='date' 
                className='date' 
                value={deploymentDate} 
                onChange={(e) => setDeploymentDate(e.target.value)} 
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-buttons">
              <button className='btn-1'>Draft</button>
              <button 
                className='btn-1' 
                type='submit'
              >
                {loading ? 'Submitting...' : 'Request'}
              </button>
            </div>

          </div>          
        </form>
      </div>
    </>
  )
}

export default ActionsDash