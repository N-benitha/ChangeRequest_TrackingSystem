import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import './ChangeRequestHistory.css'

const ChangeRequestHistory = () => {
  return (
    <>
        <div className="box-body">
          <div className="deployments">
              <span>a4sc7i.monday</span>
              <span><FontAwesomeIcon icon={faClockRotateLeft} style={{"margin": "5px"}}/> 75 Deployments</span>
          </div>

          <div className="content">
            <div className="feature">
              <div className="feature-title">
                <div className="feature-name">New Feature: Voice Assistant</div>
                <div className="feature-date">today</div>
              </div>
                
              <div className="feature-description">
                <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                <button className='btn-status'>Pending</button>
              </div>
            </div>

            <div className="feature">

              <div className="feature-title">
                <div className="feature-name">New Feature: Voice Assistant</div>
                <div className="feature-date">today</div>
              </div>
                  
              <div className="feature-description">
                <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                <button className='btn-status'>Pending</button>
              </div>
            </div>

            <div className="feature">
              <div className="feature-title">
                <div className="feature-name">New Feature: Voice Assistant</div>
                <div className="feature-date">today</div>
              </div>
                  
              <div className="feature-description">
                <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                <button className='btn-status'>Pending</button>
              </div>
            </div>

            <div className="feature">
              <div className="feature-title">
                <div className="feature-name">New Feature: Voice Assistant</div>
                <div className="feature-date">today</div>
              </div>
                
              <div className="feature-description">
                <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                <button className='btn-status'>Pending</button>
              </div>
            </div>

            <div className="feature">
              <div className="feature-title">
                <div className="feature-name">New Feature: Voice Assistant</div>
                <div className="feature-date">today</div>
              </div>
                
              <div className="feature-description">
                <span className='info'>Added a new feature that assists the user <span className='readmore'>Read more...</span></span>
                <button className='btn-status'>Pending</button>
              </div>
            </div>
              
          </div>
      </div>
    </>
  )
}

export default ChangeRequestHistory