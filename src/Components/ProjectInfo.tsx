import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import './ProjectInfo.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ProjectInfo = () => {
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
    id: string,
    description: string,
    project: Project,
    user: User,
    request_type: string,
    status: string,
    deployment_date: string,
    created_at: Date
  }
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [project, setProject] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { id } = useParams(); // projectId

  useEffect(() => {
    // const projectId = new URLSearchParams(window.location.search).get('id');

    if (!id) {
      setError("Project doesn't exist");
      return;
    }

    const fetchProject= async () => {
      try {
        const response = await axios.get(`http://localhost:3000/change-request/query?projectId=${id}`);
        setChangeRequests(response.data || []);
        setProject(response.data.project || []);
        setLoading(false);
        
    } catch (error) {
      setError(error);
    }
  };

  fetchProject();
  }, []);

  const latestDate = changeRequests.length > 0
  ? new Date(Math.max(...changeRequests.map(cr => new Date(cr.created_at).getTime())))
  : null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})
  }

  return (
    <>
            <div className="box-body">
              <div className="deployments">
                { latestDate && <span>{formatDate(latestDate)}</span>}
                <span><FontAwesomeIcon icon={faClockRotateLeft} style={{"margin": "5px"}}/> { changeRequests.length } Requests</span>
              </div>
    
              <div className="content">
                {changeRequests.length > 0 ?  changeRequests.map((changeRequest, index) => (
                  <div className="feature" key={changeRequest.id || index}>
                    <div className="feature-title">
                      <div className="feature-name">
                        {changeRequest.request_type === 'new_feature' ? <span>New Feature</span>
                        : changeRequest.request_type === 'edited_feature' ? <span>Edited Feature</span>
                        : changeRequest.request_type === 'bug_fix' ? <span>Bug Fix</span>
                        : <span>Updates</span>}: {changeRequest.description}</div>
                      <div className="feature-date">{changeRequest.created_at.toString()}</div>
                    </div>
                      
                    <div className="feature-description">
                      <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                      <button className={`btn-status ${changeRequest.status}`}>{changeRequest.status}</button>
                    </div>
                </div>
                )) : <span>No change requests yet.</span> }
                  
              </div>
          </div>
        </>
  )
}

export default ProjectInfo