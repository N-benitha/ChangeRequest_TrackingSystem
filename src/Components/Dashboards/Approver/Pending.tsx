import React, { useEffect, useState } from 'react'
import './css/Pending.css'
import api from '../../../api/axios'

/**
 * Component for displaying and managing pending change requests.
 *
 * Fetches pending change requests from the API and allows an admin or reviewer to:
 * - View details of each pending request.
 * - Approve or rollback requests, optionally providing a reason.
 * - See loading and error states.
 *
 * State Management:
 * - changeRequests: List of pending change requests.
 * - loading: Indicates if data is being loaded.
 * - error: Stores error messages, if any.
 * - openReasonInputs: Tracks which requests have their action/reason input open.
 * - reasons: Stores the reason input for each request.
 * - processingRequests: Tracks which requests are currently being processed.
 *
 * Side Effects:
 * - Fetches pending requests on mount.
 *
 * Handlers:
 * - handleReasonToggle: Opens/closes the reason input for a request.
 * - handleReasonChange: Updates the reason for a request.
 * - updateRequestStatus: Sends approval or rollback to the API.
 * - handleApprove: Approves a request.
 * - handleRollback: Rolls back a request (requires a reason).
 *
 * UI:
 * - Shows a list of pending requests with project and user info.
 * - Allows reviewing, approving, or rolling back each request.
 * - Displays loading and error messages as appropriate.
 *
 * @component
 * @returns The rendered Pending component.
 */
const Pending = () => {
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

  enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    ROLLEDBACK = "rolledback",
    DEPLOYED = "deployed"
  }

  const [changeRequests, setChangeRequests] = useState<ChangeRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track which requests have their review actions panel expanded
  const [openReasonInputs, setOpenReasonInputs] = useState<Set<string>>(new Set());
  // Store approval/rollback reasons for each request
  const [reasons, setReasons] = useState<{[requestId: string]: string}>({});
  // Track requests currently being processed to prevent double-submission
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());

  // Fetch pending change requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/change-request/query?status=${RequestStatus.PENDING}`);
        
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
        setError("Failed to fetch pending requests");
        console.log("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  /**
   * Toggle the visibility of review actions panel for a specific request
   * @param requestId - The ID of the request to toggle
   */
  const handleReasonToggle = (requestId: string) => {
    const newOpenInputs = new Set(openReasonInputs);
    if (newOpenInputs.has(requestId)) {
      newOpenInputs.delete(requestId);
    } else {
      newOpenInputs.add(requestId);
    }
    setOpenReasonInputs(newOpenInputs);
  };

  /**
   * Update the reason text for a specific request
   * @param requestId - The request ID
   * @param value - The reason text
   */
  const handleReasonChange = (requestId: string, value: string) => {
    setReasons(prev => ({
      ...prev,
      [requestId]: value
    }));
  };

  /**
   * Core function to update request status and handle UI cleanup
   * @param id - Request ID
   * @param status - New status (approved/rolledback)
   * @param reason - Optional reason for the decision
   */
  const updateRequestStatus = async (id: string, status: RequestStatus, reason?: string) => {
    try {
      // Add to processing set to disable buttons and show loading state
      setProcessingRequests(prev => new Set(prev).add(id));

      const payload: any = { status };
      if (reason && reason.trim()) {
        payload.reason = reason.trim();
      }
      
      await api.patch(`/change-request/${id}`, payload);

      // Remove from pending list since it's no longer pending
      setChangeRequests(prev => prev.filter(request => request.id !== id));

      // Clean up UI state for this request
      setOpenReasonInputs(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      setReasons(prev => {
        const newReasons = { ...prev };
        delete newReasons[id];
        return newReasons;
      });
      
      console.log(`Request ${status} successfully`);      
      
    } catch (error) {
      setError(`Failed to ${status.toLowerCase()} request`);
      console.error(`Error ${status.toLowerCase()}:`, error);      
    } finally {
      // Always remove from processing set regardless of success/failure
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  /**
   * Approve a change request (reason is optional)
   * @param id - Request ID to approve
   */
  const handleApprove = async (id: string) => {
    const reason = reasons[id] || '';
    await updateRequestStatus(id, RequestStatus.APPROVED, reason);
  };

  /**
   * Rollback/reject a change request (reason is required)
   * @param id - Request ID to rollback
   */
  const handleRollback = async (id: string) => {
    const reason = reasons[id] || '';
    // Business rule: rollbacks must have a reason to explain why
    if (!reason.trim()) {
      setError("Reason is required for rollbacks");
      return;
    }
    await updateRequestStatus(id, RequestStatus.ROLLEDBACK, reason);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="box-body">
      <div style={{textAlign: 'center', padding: '40px', color: '#fff'}}>
        Loading pending requests...
      </div>
    </div>
  );
  
  if (error) return (
    <div className="box-body">
      <div style={{color: '#F44336', textAlign: 'center', padding: '20px'}}>
        Error: {error}
      </div>
    </div>
  );

  return (
    <>
      <div className="box-body">
        <div className="pending-header" style={{marginBottom: '25px'}}>
          <h2 style={{color: '#fff', margin: 0, fontSize: '1.5rem'}}>
            Pending Change Requests
          </h2>
          <span style={{color: '#a8b2b2', fontSize: '0.9rem'}}>
            {changeRequests.length} requests awaiting approval
          </span>
        </div>

        <div className="content">
          {changeRequests.length > 0 ? 
            changeRequests.map((changeRequest, index) => (
              <div className="feature" key={changeRequest.id || index}>
                <div className="feature-title">
                  <div className="feature-name">
                    {changeRequest.request_type} - {changeRequest.project.title}
                  </div>
                  <div className="feature-date">
                    {formatDate(changeRequest.updated_at)}
                  </div>
                </div>
                
                {/* Request details and review button */}
                <div className="feature-description">
                  <strong>Requested by:</strong> {changeRequest.user.username}
                  <div className='info'>
                    {changeRequest.description} 
                    <span className='readmore'>Read more...</span>
                  </div>
                  
                  <button 
                    className='btn' 
                    onClick={() => handleReasonToggle(changeRequest.id)} 
                    disabled={processingRequests.has(changeRequest.id)}
                  >
                    {openReasonInputs.has(changeRequest.id) ? 'Hide Actions' : 'Review Request'}
                  </button>
                </div>
                
                {/* Expandable review actions panel */}
                {openReasonInputs.has(changeRequest.id) && (
                  <div className="feature-reason">
                    <textarea 
                      className="reason" 
                      placeholder='Add reason for approval/rollback...' 
                      value={reasons[changeRequest.id] || ''} 
                      onChange={(e) => handleReasonChange(changeRequest.id, e.target.value)} 
                      disabled={processingRequests.has(changeRequest.id)}
                      rows={3}
                    />
                    <div className="btns">
                      <button 
                        className='btn-approve' 
                        onClick={() => handleApprove(changeRequest.id)} 
                        disabled={processingRequests.has(changeRequest.id)}
                      >
                        {processingRequests.has(changeRequest.id) ? 'Processing...' : 'Approve'}
                      </button>
                      <button 
                        className='btn-rollback' 
                        onClick={() => handleRollback(changeRequest.id)} 
                        disabled={processingRequests.has(changeRequest.id)}
                      >
                        {processingRequests.has(changeRequest.id) ? 'Processing...' : 'Rollback'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
            : (
              <span>No pending requests found. All caught up!</span>
            )
          }            
        </div>
      </div>
    </>
  )
}

export default Pending