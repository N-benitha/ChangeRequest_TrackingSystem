import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import './AssignProjects.css'

const AssignProjects = () => {
  return (
    <div className='assign-container'>
      <div className="username">Carl Johnson</div>
      <div className="user-projects">
        <h3>Projects</h3>
        <div className="project-content">
          <div className="project-items">
            <div className='item1'>
              <span className='title'>Voice Assistant Feature</span>
              <span className='date'>2 weeks ago</span>
            </div>
            <button className='btn-deployed'>Deployed</button>
          </div>

          <div className="project-items">
            <div className='item1'>
              <span className='title'>Voice Assistant Feature</span>
              <span className='date'>2 weeks ago</span>
            </div>
            <button className='btn-deployed'>Deployed</button>
          </div>

          <div className="project-items">
            <div className='item1'>
              <span className='title'>Voice Assistant Feature</span>
              <span className='date'>2 weeks ago</span>
            </div>
            <button className='btn-pending'>Pending</button>
          </div>

          <div className="project-items">
            <div className='item1'>
              <span className='title'>Voice Assistant Feature</span>
              <span className='date'>2 weeks ago</span>
            </div>
            <button className='btn-rolledback'>Rolledback</button>
          </div>

        </div>
        
      </div>
      <div className="project-item">
        <p>Assign New Project:</p>
        <input type="text" name="" id="" className='project-text' placeholder='search project'/>
      </div>

      <div className="project-item">
        <p>Revoke Project:</p>
        <input type="text" name="" id="" className='project-text' placeholder='search project'/>
      </div>

      <button className='btn-save'>Save Changes</button>
    </div>
  )
}

export default AssignProjects