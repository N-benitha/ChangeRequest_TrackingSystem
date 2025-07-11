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
        setChangeRequests(response.data);

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
      setError(`Failed to set ${status.toLowerCase()} request`);
      console.error(`Error ${status.toLowerCase}:`, error);      
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
  if (loading) return <div>Loading pending requests...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <>
      <div className="box-body">
        <div className="content">
          {changeRequests.length > 0 ? 
          changeRequests.map((changeRequest, index) => (
            <div className="feature" key={changeRequest.id || index}>
            <div className="feature-title">
              <div className="feature-name">{changeRequest.request_type} - {changeRequest.project.title}</div>
              <div className="feature-date">{new Date(changeRequest.updated_at).toLocaleDateString()}</div>
            </div>
            <div className="feature-description">
              <strong>By:</strong> {changeRequest.user.username}<br/>
              <span className='info'>{changeRequest.description} <span className='readmore'>Read more...</span></span>
              <button className='btn' onClick={() => handleReasonToggle(changeRequest.id)} disabled={processingRequests.has(changeRequest.id)}>
                {openReasonInputs.has(changeRequest.id) ? 'Hide Actions' : 'Approve/Rollback'}
              </button>
            </div>
            {openReasonInputs.has(changeRequest.id) && (
              <div className="feature-reason">
              <input 
                type="text" 
                className="reason" 
                placeholder='Add reason' 
                value={reasons[changeRequest.id] || ''} 
                onChange={(e) => handleReasonChange(changeRequest.id, e.target.value)} 
                disabled={processingRequests.has(changeRequest.id)}
              />
              <div className="btns">
                  <button className='btn-approve' onClick={() => handleApprove(changeRequest.id)} disabled={processingRequests.has(changeRequest.id)}>
                    {processingRequests.has(changeRequest.id) ? 'Processing...' : 'Approve'}
                  </button>
                  <button className='btn-rollback' onClick={() => handleRollback(changeRequest.id)} disabled={processingRequests.has(changeRequest.id)}>
                    {processingRequests.has(changeRequest.id) ? 'Processing...' : 'Roll back'}
                  </button>
              </div>
            </div>
            )}
          </div>
          ))
          : <span>No pending requests.</span>}            
        </div>
      </div>
    </>
  )
}

export default Pending