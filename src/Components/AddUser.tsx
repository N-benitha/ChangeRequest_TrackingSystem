import React, { useState } from 'react'
import './AddUser.css'
import axios from 'axios';

const AddUser = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userType, setUserType] = useState('');
    const [userStatus, setUserStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
            `http://localhost:3000/auth/create`,
            {
                username: name,
                email: email,
                password: password,
                user_type: userType,
                status: userStatus
            });

            setName('');
            setEmail('');
            setPassword('');
            setUserType('');
            setUserStatus('');
            setError('');
            
        } catch (error) {
            setError(error)
            console.error("User wasn't created", error);
        }
    }

  return (
    <div className="user-container">
      <form onSubmit={handleSubmit}>
        <h2>New User</h2>
        <div className="form-content">
          <div className="form-content-item">
            <p>Username:</p>
            <input type="text" className='user-text' placeholder='Enter Name' onChange={(e) => setName(e.target.value)}/>
          </div>

          <div className="form-content-item">
            <p>Email:</p>
            <input type="email" className='user-email' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="form-content-item">
            <p>Password:</p>
            <input type="password" className='user-password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)}/>
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
              <option value="" disabled hidden>Select status</option>
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

export default AddUser