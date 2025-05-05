import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './ProjectsDash.css'

const ProjectsDash = () => {
  return (
    <div className='projectsdash-container'>
      <div className="dash-box2">
        <div className="box-head">
          <p>Projects / ChatBot</p>
          <button className='btn-1'>Dia</button>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Projects</Link>
              <Link to={'./project-info'}>Project Information</Link>
          </div>
          <hr />
        </div>

      </div>
      <div className="projectsdash-subcontainer">
        <Outlet/>
      </div>
    </div>
  )
}

export default ProjectsDash