import React, { useEffect, useState } from 'react'
import './css/RolledBack.css'
import api from '../../../api/axios'

/**
 * RolledBack component displays a list of change requests that have been rolled back.
 *
 * - Fetches rolled back change requests from the API on mount.
 * - Handles loading and error states.
 * - Allows users to expand/collapse each request to view detailed information.
 * - Displays request metadata, including status, project, user, and rollback reason.
 * - Uses color-coded badges to indicate request status.
 *
 * @component
 * @returns The rendered component displaying rolled back change requests.
 */
const RolledBack = () => {
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
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());

  // Fetch rolled back change requests
  useEffect(() => {
    const fetchRolledBackRequests = async () => {
      try {
        const response = await api.get(`/change-request/query?status=${RequestStatus.ROLLEDBACK}`);
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          setChangeRequests(response.data);
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          setChangeRequests(response.data.requests);
        } else {
          console.warn('Unexpected response format:', response.data);
          setChangeRequests([]);
        }

      } catch (error) {
        setError("Failed to fetch rolled back requests");
        console.error("Error fetching rolled back requests:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRolledBackRequests();
  }, []);

  // Toggle expanded view for request details
  const toggleExpanded = (requestId: string) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRequests(newExpanded);
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

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'rolledback': return '#dc3545';
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'deployed': return '#007bff';
      default: return '#6c757d';
    }
  };

  if (loading) return <div>Loading rolled back requests...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <>
      <div className="box-body">
        <div className="rolledback-header">
          <h2>Rolled Back Change Requests</h2>
          <span className="request-count">{changeRequests.length} rolled back requests</span>
        </div>

        <div className="features">
          {changeRequests.length > 0 ? 
            changeRequests.map((changeRequest, index) => (
              <div className="feature" key={changeRequest.id || index}>
                <div className="feature-header">
                  <div className="feature-title">
                    <div className="feature-name">
                      <span className="request-type">{changeRequest.request_type}</span>
                      <span className="project-name">- {changeRequest.project.title}</span>
                    </div>
                    <div className="feature-meta">
                      <span 
                        className="status-badge" 
                        style={{backgroundColor: getStatusColor(changeRequest.status)}}
                      >
                        {changeRequest.status.toUpperCase()}
                      </span>
                      <span className="feature-date">
                        Rolled back: {formatDate(changeRequest.updated_at)}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className="expand-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent feature hover
                      toggleExpanded(changeRequest.id);
                    }}
                  >
                    {expandedRequests.has(changeRequest.id) ? '▼' : '▶'}
                  </button>
                </div>

                {/* Expanded details */}
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
                          <strong>Original Deployment Date:</strong>
                          <span>{formatDate(changeRequest.deployment_date)}</span>
                        </div>
                      )}

                      {changeRequest.reason && (
                        <div className="detail-row rollback-reason">
                          <strong>Rollback Reason:</strong>
                          <span className="reason-text">{changeRequest.reason}</span>
                        </div>
                      )}

                      <div className="detail-row">
                        <strong>Originally Created:</strong>
                        <span>{formatDate(changeRequest.created_at)}</span>
                      </div>

                      <div className="detail-row">
                        <strong>Request Type:</strong>
                        <span className="request-type-detail">{changeRequest.request_type}</span>
                      </div>
                    </div>

                    {/* Info section for rolled back requests */}
                    <div className="rollback-info">
                      <div className="info-box">
                        <strong>📋 Status:</strong> This change request has been rolled back and will not be deployed.
                        {changeRequest.reason && (
                          <><br/><strong>Reason:</strong> {changeRequest.reason}</>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
            : (
              <div className="no-requests">
                <p>No rolled back requests found.</p>
                <span>Rolled back change requests will appear here.</span>
              </div>
            )
          }            
        </div>
      </div>
    </>
  )
}

export default RolledBack