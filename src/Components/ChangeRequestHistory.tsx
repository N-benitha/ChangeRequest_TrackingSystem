import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import './ChangeRequestHistory.css'
import api from '../api/axios'
import { useParams } from 'react-router-dom'

const ChangeRequestHistory = () => {
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
  interface ChangeRequests {
    id: string;
    description: string;
    project: Project;
    user: User;
    request_type: string;
    status: string;
    created_at: string;
    updated_at: string;
  }
  const [changeRequests, setChangeRequests] = useState<ChangeRequests[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: projectId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await api.get(`/auth/me`);
        const currentUser = userInfo.data.user;
        setUser(currentUser);

        if (!currentUser?.id) throw new Error("User ID not found");
        if (!projectId) throw new Error("Project ID not found in URL");

        console.log(`Fetching change requests for userId: ${currentUser.id} on projectId: ${projectId}`);
        
        const response = await api.get(`/change-request/query?userId=${currentUser.id}&projectId=${projectId}`);
        console.log('Change requests response:', response.data);
        
        setChangeRequests(response.data);

      } catch (error) {
        setError("Failed to fetch request info");
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>

  return (
    <>
        <div className="box-body">
          <div className="deployments">
              {/* <span>a4sc7i.monday</span> */}
              <span><FontAwesomeIcon icon={faClockRotateLeft} style={{"margin": "5px"}}/> {changeRequests.length} change requests</span>
          </div>

          <div className="content">
            {changeRequests.length > 0 ? (
              changeRequests.map((changeRequest, index) => (
                <div className="dev-feature" key={changeRequest.id || index}>
                  <div className="dev-feature-title">
                    <div className="dev-feature-name">{changeRequest.request_type}:</div>
                    <div className="dev-feature-date">{changeRequest.updated_at}</div>
                  </div>
                    
                  <div className="dev-feature-description">
                    <span className='dev-info'>{changeRequest.description} <span className='readmore'>Read more...</span></span>
                    <button className={`dev-btn-status ${changeRequest.status}`}>{changeRequest.status}</button>
                  </div>
              </div>))
            ) : (
              <span>No Change Requests Yet.</span>
            )}              
          </div>
      </div>
    </>
  )
}

export default ChangeRequestHistory