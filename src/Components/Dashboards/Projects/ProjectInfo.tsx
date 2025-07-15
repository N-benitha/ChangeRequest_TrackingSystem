import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import './css/ProjectInfo.css'
import { useParams } from 'react-router-dom'
import api from '../../../api/axios'

/**
 * Displays detailed information about a specific project, including its change requests.
 *
 * - Fetches and lists all change requests associated with the project.
 * - Shows the last updated date and the total number of requests.
 * - Formats dates and relative times for display.
 * - Handles loading and error states.
 *
 * @component
 * @returns The rendered ProjectInfo component.
 *
 */
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
    created_at: string
  }
  
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [user, setUser] = useState<User[]>([]);
  const [project, setProject] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const { id } = useParams(); // projectId

  useEffect(() => {
    if (!id) {
      setError("Project doesn't exist");
      setLoading(false);
      return;
    }

    // Fetch change requests for the specified project on component mount
    const fetchProject = async () => {
      try {
        const response = await api.get(`/change-request/query?projectId=${id}`);
        setChangeRequests(response.data || []);
        setProject(response.data.project || []);
        
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Calculate most recent change request date
  const latestDate = changeRequests.length > 0
    ? new Date(Math.max(...changeRequests.map(cr => new Date(cr.created_at).getTime())))
    : null;

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatRelativeTime = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  const getRequestTypeDisplay = (requestType: string) => {
    switch (requestType) {
      case 'new_feature': return 'New Feature';
      case 'edited_feature': return 'Edited Feature';
      case 'bug_fix': return 'Bug Fix';
      default: return 'Updates';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="box-body">
        <div className="deployments">
          {latestDate && (
            <span>Last updated: {formatDate(latestDate)}</span>
          )}
          <span>
            <FontAwesomeIcon icon={faClockRotateLeft} style={{"margin": "5px"}}/>
            {changeRequests.length} Request{changeRequests.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="content">
          {changeRequests.length > 0 ? changeRequests.map((changeRequest, index) => (
            <div className="project-feature" key={changeRequest.id || index}>
              <div className="project-feature-title">
                <div className="project-feature-name">
                  {getRequestTypeDisplay(changeRequest.request_type)}: {changeRequest.description}
                </div>
                <div className="project-feature-date" title={formatDate(changeRequest.created_at)}>
                  {formatRelativeTime(changeRequest.created_at)}
                </div>
              </div>
                
              <div className="project-feature-description">
                <span className='project-info'>
                  {changeRequest.user?.username && (
                    <span>By {changeRequest.user.username} • </span>
                  )}
                  <span className='readmore'>Read more...</span>
                </span>
                <button className={`project-btn-status ${changeRequest.status}`}>
                  {changeRequest.status}
                </button>
              </div>
            </div>
          )) : (
            <div className="no-requests">
              <span>No change requests yet.</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProjectInfo