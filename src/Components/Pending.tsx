import React, { useEffect, useState } from 'react'
import './Pending.css'
import api from '../api/axios';

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
  const [openReasonInputs, setOpenReasonInputs] = useState<Set<string>>(new Set());
  const [reasons, setReasons] = useState<{[requestId: string]: string}>({});
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/change-request/query?status=${RequestStatus.PENDING}`);
        
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

  const handleReasonToggle = (requestId: string) => {
    const newOpenInputs = new Set(openReasonInputs);
    if (newOpenInputs.has(requestId)) {
      newOpenInputs.delete(requestId);
    } else {
      newOpenInputs.add(requestId);
    }
    setOpenReasonInputs(newOpenInputs);
  };

  const handleReasonChange = (requestId: string, value: string) => {
    setReasons(prev => ({
      ...prev,
      [requestId]: value
    }));
  };

  const updateRequestStatus = async (id: string, status: RequestStatus, reason?: string) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(id));

      const payload: any = { status };
      if (reason && reason.trim()) {
        payload.reason = reason.trim();
      }
      
      await api.patch(`/change-request/${id}`, payload);

      setChangeRequests(prev => prev.filter(request => request.id !== id));

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
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleApprove = async (id: string) => {
    const reason = reasons[id] || '';
    await updateRequestStatus(id, RequestStatus.APPROVED, reason);
  };

  const handleRollback = async (id: string) => {
    const reason = reasons[id] || '';
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