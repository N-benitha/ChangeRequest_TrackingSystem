import React, { useEffect, useState } from 'react'
import './Approved.css'
import api from '../api/axios';

/**
 * Approved component displays a list of approved change requests and allows marking them as deployed.
 *
 * - Fetches approved change requests from the API on mount.
 * - Displays each request with expandable details, including description, requester, project, and dates.
 * - Allows users to mark a request as "Deployed", updating its status via the API.
 * - Handles loading and error states, and visually indicates processing requests.
 * - Uses local state to manage expanded/collapsed requests and processing status.
 * 
 * @component
 * @returns The rendered Approved change requests UI.
 */
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
  // Track which requests are currently being processed to prevent double-clicks
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  // Track which request details are expanded in the UI
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());

  // Fetch approved change requests on component mount
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      try {
        const response = await api.get(`/change-request/query?status=${RequestStatus.APPROVED}`);
        
        // Handle different possible API response formats
        if (Array.isArray(response.data)) {
          setChangeRequests(response.data);
        } else if (response.data.requests && Array.isArray(response.data.requests)) {
          setChangeRequests(response.data.requests);
        } else {
          console.warn('Unexpected response format:', response.data);
          setChangeRequests([]);
        }
        
      } catch (error) {
        setError("Failed to fetch approved requests");
        console.error("Error fetching approved requests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApprovedRequests();
  }, []);

  /**
   * Toggle expand/collapse state for a specific request's details
   * @param requestId - The ID of the request to toggle
   */
  const toggleExpanded = (requestId: string) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRequests(newExpanded);
  };
  
  /**
   * Mark an approved request as deployed and remove it from the list
   * @param id - The ID of the request to mark as deployed
   */
  const handleMarkAsDeployed = async (id: string) => {
    try {
      // Add to processing set to disable button and show loading state
      setProcessingRequests(prev => new Set(prev).add(id));
      await api.patch(`/change-request/${id}`, {
        status: RequestStatus.DEPLOYED
      });

      // Remove from approved list since it's now deployed
      setChangeRequests(prev => prev.filter(request => request.id !== id));
      console.log('Request marked as deployed successfully');

    } catch (error) {
      setError("Failed to mark as deployed");
      console.error("Error marking as deployed:", error);
    } finally {
      // Remove from processing set regardless of success/failure
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };
  
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
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <>
      <div className="approved-box-body">
        <div className="approved-header">
          <h2>Approved Change Requests</h2>
          <span className='approved-request-count'>{changeRequests.length} approved requests</span>
        </div>

        <div className="approved-content">
          {changeRequests.length > 0 ?
            changeRequests.map((changeRequest, index) => (
              <div className="approved-feature" key={changeRequest.id || index}>
                <div className="approved-feature-header">

                  <div className="approved-feature-title">
                    <div className="approved-feature-name">
                      <span className='approved-request-type'>{changeRequest.request_type}</span>
                      <span className="approved-project-name">- {changeRequest.project.title}</span>
                    </div>
                    <div className="approved-feature-meta">
                      <span className='approved-status-badge' style={{backgroundColor: getStatusColor(changeRequest.status)}}>
                        {changeRequest.status.toUpperCase()}
                      </span>
                      <span className="approved-feature-date">
                        Approved: {formatDate(changeRequest.updated_at)}
                      </span>
                    </div>
                  </div>

                  <button 
                    className="approved-expand-btn" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      toggleExpanded(changeRequest.id);
                    }}
                  >
                    {expandedRequests.has(changeRequest.id) ? '▼' : '▶'}
                  </button>
                </div>

                {/* Expandable details section */}
                {expandedRequests.has(changeRequest.id) && (
                  <div className="approved-feature-details">
                    <div className="approved-feature-description">
                      <div className="approved-detail-row">
                        <strong>Description:</strong>
                        <span>{changeRequest.description}</span>
                      </div>
                      
                      <div className="approved-detail-row">
                        <strong>Requested by:</strong>
                        <span>{changeRequest.user.username}</span>
                      </div>

                      <div className="approved-detail-row">
                        <strong>Project:</strong>
                        <span>{changeRequest.project.title}</span>
                      </div>

                      {changeRequest.deployment_date && (
                        <div className="approved-detail-row">
                          <strong>Scheduled Deployment:</strong>
                          <span>{formatDate(changeRequest.deployment_date)}</span>
                        </div>
                      )}

                      {changeRequest.reason && (
                        <div className="approved-detail-row">
                          <strong>Approval Reason:</strong>
                          <span>{changeRequest.reason}</span>
                        </div>
                      )}

                      <div className="approved-detail-row">
                        <strong>Created:</strong>
                        <span>{formatDate(changeRequest.created_at)}</span>
                      </div>
                    </div>

                    <div className="approved-feature-actions">
                      <button 
                        className="approved-btn-deploy"
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
              // Empty state when no approved requests exist
              <div className="approved-no-requests">
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