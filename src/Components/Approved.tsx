import React, { useEffect, useState } from 'react'
import './Approved.css'
import api from '../api/axios';

const Approved = () => {
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
    deployment_date?: string;
    reason?: string;
  }

  enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    ROLLEDBACK = "rolledback",
    DEPLOYED = "deployed"
  }

  
  const [changeRequests, setChangeRequests] = useState<ChangeRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await api.get(`/change-request/query?status=${RequestStatus.APPROVED}`);
        setChangeRequests(response.data);
      } catch (error) {
        setError("Failed to fetch approved requests");
        console.error("Error fetching approved requests:", error);
      } finally {
      setLoading(false);
      }
    }
    fetchApprovedRequests();
  }, []);

 const toggleExpanded = (requestId: string) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRequests (newExpanded);
  };
  
  const handleMarkAsDeployed = async (id: string) => {
    try {
      setProcessingRequests (prev => new Set (prev).add(id));
      await api.patch(`/change-request/${id}`, {
        status: RequestStatus.DEPLOYED
      });

      setChangeRequests(prev => prev.filter(request => request.id !== id));
      console.log('Request marked as deployed successfully');

    } catch (error) {
      setError("Failed to mark as deployed");
      console.error("Error marking as deployed:", error);
    } finally {
      setProcessingRequests (prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return '#28a745'; 
      case 'deployed': return '#007bff'; 
      default: return '#6c757d';
    }
  };
  if (loading) return <div>Loading approved requests...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>

  return (
    <>
        <div className="box-body">
          <div className="approved-header">
            <h2>Approved Change Requests</h2>
            <span className='request-count'>{changeRequests.length} approved requests</span>
          </div>

          <div className="content">
            {changeRequests.length > 0 ?
              changeRequests.map((changeRequest, index) => (
                <div className="feature" key={changeRequest.id || index}>
                  <div className="feature-header">
                    <div className="feature-title">
                      <div className="feature-name">
                        <span className='request-type'>{changeRequest.request_type}</span>
                        <span className="project-name">{changeRequest.project.title}</span>
                      </div>
                      <div className="feature-meta">
                        <span className='status-badge' style={{backgroundColor: getStatusColor(changeRequest.status)}}>
                          {changeRequest.status.toUpperCase()}
                        </span>
                        <span className="feature-date">
                          Approved: {formatDate(changeRequest.updated_at)}
                        </span>
                      </div>
                    </div>
                    <button className='"expand-btn' onClick={() => toggleExpanded(changeRequest.id)}>
                      {expandedRequests.has(changeRequest.id) ? '▼' : '▶'}
                    </button>
                  </div>

                  {expandedRequests.has(changeRequest.id) && (
                  <div className="feature-details">
                    <div className="feature-description">
                      <div className="detail-row">
                        <strong>Description:</strong>
                        <span>{changeRequest.description}</span>
                      </div>
                      
                      <div className="detail-row">
                        <strong>Requested by:</strong>
                        <span>{changeRequest.user.username}</span>
                      </div>

                      <div className="detail-row">
                        <strong>Project:</strong>
                        <span>{changeRequest.project.title}</span>
                      </div>

                      {changeRequest.deployment_date && (
                        <div className="detail-row">
                          <strong>Scheduled Deployment:</strong>
                          <span>{formatDate(changeRequest.deployment_date)}</span>
                        </div>
                      )}

                      {changeRequest.reason && (
                        <div className="detail-row">
                          <strong>Approval Reason:</strong>
                          <span>{changeRequest.reason}</span>
                        </div>
                      )}

                      <div className="detail-row">
                        <strong>Created:</strong>
                        <span>{formatDate(changeRequest.created_at)}</span>
                      </div>
                    </div>

                    <div className="feature-actions">
                      <button 
                        className="btn-deploy"
                        onClick={() => handleMarkAsDeployed(changeRequest.id)}
                        disabled={processingRequests.has(changeRequest.id)}
                      >
                        {processingRequests.has(changeRequest.id) ? 'Processing...' : 'Mark as Deployed'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              )) : (
                <div className="no-requests">
                  <p>No approved requests found.</p>
                  <span>Approved change requests will appear here.</span>
                </div>
              )
            }
          </div>
        </div>
    </>
  )
}

export default Approved