import React, { useEffect, useState } from 'react'
import './Reports.css'
import { Link } from 'react-router-dom'
import api from '../api/axios';

interface User {
  id: string;
  username: string;
  email: string;
  user_type?: string;
  status?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
}

interface ChangeRequest {
  id: string;
  description?: string;
  project?: Project;
  user?: User;
  request_type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  deployment_date?: string;
  reason?: string;
}

const Reports: React.FC = () => {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setError(null);

        const userInfo = await api.get('/auth/me');
        const userData: User = userInfo.data.user;
        setCurrentUser(userData);

        const response = await api.get('/change-request/all-users');
        
        console.log('API Response:', response.data);
        
        let requests: ChangeRequest[] = [];
        
        if (Array.isArray(response.data)) {
          requests = response.data as ChangeRequest[];
        } else if (response.data && typeof response.data === 'object') {
          if ('requests' in response.data && Array.isArray(response.data.requests)) {
            requests = response.data.requests as ChangeRequest[];
          } else {
            requests = [response.data as ChangeRequest];
          }
        }
        
        console.log('Processed requests:', requests);
        setChangeRequests(requests);

      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch change requests";
        setError(errorMessage);
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getFilteredAndSortedRequests = (): ChangeRequest[] => {
    let filtered = changeRequests;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(request => request.status === filterStatus);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        case 'oldest':
          const dateA2 = new Date(a.created_at || 0).getTime();
          const dateB2 = new Date(b.created_at || 0).getTime();
          return dateA2 - dateB2;
        case 'project':
          const projectA = a.project?.title || 'Unknown Project';
          const projectB = b.project?.title || 'Unknown Project';
          return projectA.localeCompare(projectB);
        case 'status':
          const statusA = a.status || 'unknown';
          const statusB = b.status || 'unknown';
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FFC107';
      case 'approved': return '#28A745';
      case 'deployed': return '#007BFF';
      case 'rolledback': return '#DC3545';
      default: return '#6C757D';
    }
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredRequests = getFilteredAndSortedRequests();

  if (loading) {
    return (
      <div className='reports-container'>
        <div className="reports-loading">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='reports-container'>
        <div className="reports-error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className='reports-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Reports</p>
          <div className='box-logout'>
            <button className='btn-1' onClick={handleDropdownToggle}>
              {currentUser?.username || 'User'}
            </button>
            <span 
              className={`logout-dropdown ${isDropdownOpen ? 'show' : ''}`} 
              onClick={handleLogout}
            >
              Log out
            </span>
          </div>
        </div>
                
        <div className="box-titles">
          <div className="titles">
            <Link to={'./'}>Reports</Link>
          </div>
          <hr />
        </div>

        <div className="reports-controls">
          <div className="reports-stats">
            <div className="stat-item">
              <span className="stat-number">{filteredRequests.length}</span>
              <span className="stat-label">Total Requests</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {filteredRequests.filter(r => r.status === 'pending').length}
              </span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {filteredRequests.filter(r => r.status === 'approved').length}
              </span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {filteredRequests.filter(r => r.status === 'deployed').length}
              </span>
              <span className="stat-label">Deployed</span>
            </div>
          </div>

          <div className="filter-controls">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="deployed">Deployed</option>
              <option value="rolledback">Rolled Back</option>
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="project">By Project</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>
      </div>

      <div className="reports-subcontainer">
        <div className="item-component">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => (
              <div className="item1" key={request.id || index}>
                <div className="request-header">
                  <div className="req-name">
                    {request.project?.title || 'Unknown Project'}: {request.description || 'No description'}
                  </div>
                  <div className="status-badge" style={{backgroundColor: getStatusColor(request.status)}}>
                    {request.status?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
                
                <div className="request-details">
                  <div className="owner">
                    <div className="owner-name">{request.user?.username || 'Unknown User'}</div>
                    <div className="on">
                      authored on {request.created_at ? formatDate(request.created_at) : 'Unknown date'}
                    </div>
                  </div>
                  
                  <div className="request-meta">
                    <div className="change-type">{request.request_type || 'Unknown'}</div>
                    {request.updated_at && request.updated_at !== request.created_at && (
                      <div className="last-updated">
                        Updated: {formatDate(request.updated_at)}
                      </div>
                    )}
                  </div>
                </div>

                {request.reason && (
                  <div className="request-reason">
                    <strong>Reason:</strong> {request.reason}
                  </div>
                )}

                {request.deployment_date && (
                  <div className="deployment-date">
                    <strong>Scheduled:</strong> {formatDate(request.deployment_date)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-reports">
              <p>No change requests found</p>
              <span>Try adjusting your filters or check back later</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports