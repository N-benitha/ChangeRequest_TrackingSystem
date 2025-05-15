import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import './ProjectInfo.css'
import axios from 'axios'

const ProjectInfo = () => {
  interface ChangeRequest {
    id: string,
    description: string,
    projectId: string,
    userId: string,
    request_type: string,
    status: string,
    deployment_date: string,
    created_at: Date
  }
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectId = new URLSearchParams(window.location.search).get('id');

    if (!projectId) {
      setError("Project doesn't exist");
      return;
    }

    const fetchProject= async () => {
      try {
        const response = await axios.get(`http://localhost:3000/change-request/${projectId}`);
        setChangeRequests(response.data);
        setProjectId(response.data.projectId);
        setUserId(response.data.userId);
        setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  fetchProject();
  }, []);

  return (
    <>
            <div className="box-body">
              <div className="deployments">
                  <span>a4sc7i.monday</span>
                  <span><FontAwesomeIcon icon={faClockRotateLeft} style={{"margin": "5px"}}/> 75 Deployments</span>
              </div>
    
              <div className="content">
                {changeRequests &&  changeRequests.map((changeRequest, index) => (
                  <div className="feature">
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
                    <button className='btn-status'>{changeRequest.status}</button>
                  </div>
                </div>
                ))}
                <div className="feature">
                  <div className="feature-title">
                    <div className="feature-name">New Feature: Voice Assistant</div>
                    <div className="feature-date">today</div>
                  </div>
                    
                  <div className="feature-description">
                    <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                    <button className='btn-status'>Pending</button>
                  </div>
                </div>
    
                <div className="feature">
    
                  <div className="feature-title">
                    <div className="feature-name">New Feature: Voice Assistant</div>
                    <div className="feature-date">today</div>
                  </div>
                      
                  <div className="feature-description">
                    <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                    <button className='btn-status'>Pending</button>
                  </div>
                </div>
    
                <div className="feature">
                  <div className="feature-title">
                    <div className="feature-name">New Feature: Voice Assistant</div>
                    <div className="feature-date">today</div>
                  </div>
                      
                  <div className="feature-description">
                    <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                    <button className='btn-status'>Pending</button>
                  </div>
                </div>
    
                <div className="feature">
                  <div className="feature-title">
                    <div className="feature-name">New Feature: Voice Assistant</div>
                    <div className="feature-date">today</div>
                  </div>
                    
                  <div className="feature-description">
                    <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                    <button className='btn-status'>Pending</button>
                  </div>
                </div>
    
                <div className="feature">
                  <div className="feature-title">
                    <div className="feature-name">New Feature: Voice Assistant</div>
                    <div className="feature-date">today</div>
                  </div>
                    
                  <div className="feature-description">
                    <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                    <button className='btn-status'>Pending</button>
                  </div>
                </div>
                  
              </div>
          </div>
        </>
  )
}

export default ProjectInfo