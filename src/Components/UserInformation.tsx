import React, { useEffect, useState } from 'react'
import './UserInformation.css'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const UserInformation = () => {
  interface User {
    id: string;
    username: string;
    email: string,
    password: string,
    user_type?: string;
    status?: string;
}

  const [user, setUser] = useState<User | null>();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get('id');

    if (!userId) {
      setError("User doesn't exist");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get(`http://localhost:3000/users/${userId}`);
        setUser(response.data);
        setUserName(response.data.username)
        setUserType(response.data.user_type);
        setUserStatus(response.data.status);
      } catch (error) {
        setError(error);
        console.log("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(
        `http://localhost:3000/users/${user?.id}`,
        {       
          username: userName,
          user_type: userType,
          status: userStatus
        }
      );
      navigate('../');
      alert('Changes saved!');
      console.log("User Updated");
      
    } catch (error) {
      setError("Failed to save changes");
      console.log(error);
      
    }
  }
  
  return (
    <div className="user-container">
      <form onSubmit={handleSubmit}>
        <h2>User Information</h2>
        <div className="form-content">
          <div className="form-content-item">
            <p>Usename: <strong style={{color: 'white', paddingLeft: '10px'}}> {userName}</strong></p>
            <input type="text" className='user-text' placeholder='New Name' onChange={(e) => setUserName(e.target.value)}/>
          </div>

          <div className="form-content-item">
            <p>User Type</p>
            <select name='change-type' className='change-type' value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="" disabled hidden>Select type</option>
              <option value="developer">Developer</option>
              <option value="approver">Approver</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-content-item">
            <p>Status</p>
            <select name='change-status'className='change-status' value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
            </select>
          </div>

          <button type="submit" className='btn-1'>Save Changes</button>

        </div>          

      </form>

    </div>
  )
}

export default UserInformation