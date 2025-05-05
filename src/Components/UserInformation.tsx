import React from 'react'
import './UserInformation.css'

const UserInformation = () => {
  return (
    <div className="user-container">
      <form>
        <h2>User Information</h2>
        <div className="form-content">
          <div className="form-content-item">
            <p>Name</p>
            <input type="text" name="" id="" className='user-text'/>
          </div>

          <div className="form-content-item">
            <p>User Type</p>
            <select name='change-type' id='change-type' className='change-type'>
              <option value="1">Developer</option>
              <option value="2">Approver</option>
              <option value="3">Admin</option>
            </select>
          </div>

          <div className="form-content-item">
            <p>Status</p>
            <select name='change-type' id='change-type' className='change-type'>
              <option value="1">Active</option>
              <option value="2">Idle</option>
            </select>
          </div>

          <button className='btn-1'>Save Changes</button>

        </div>          

      </form>

    </div>
  )
}

export default UserInformation