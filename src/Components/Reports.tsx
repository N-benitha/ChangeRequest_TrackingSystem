import React from 'react'
import './Reports.css'
import { Link } from 'react-router-dom'

const Reports = () => {
  return (
    <div className='reports-container'>
      <div className="dash-box2">
        <div className="box-head">
        <p>Reports</p>
          <button className='btn-1'>Dia</button>
        </div>
        
        <div className="box-titles">
          <div className="titles">
              <Link to={'./'}>Reports</Link>
              {/* <Link to={'./user-info'}>Reports Information</Link> */}
          </div>
          <hr />
        </div>

      </div>
      <div className="reports-subcontainer">
        <div className="item-component">
            <div className="item1">
                <div className="req-name">Chatbot: Voice assistant update</div>
                <div className="owner">
                    <div className="owner-name">Carl Johson</div>
                    <div className="on">authored on 4/03/2025</div>
                </div>
                <div className="change-type">Update</div>
            </div>

            <div className="item1">
                <div className="req-name">LinkedIn: Photo uploads</div>
                <div className="owner">
                    <div className="owner-name">Beatrice Hogozo</div>
                    <div className="on">authored on 26/01/25</div>
                </div>
                <div className="change-type">Update</div>
            </div>

            <div className="item1">
                <div className="req-name">Calendly: Location feature</div>
                <div className="owner">
                    <div className="owner-name">Tom Cruiz</div>
                    <div className="on">authored on 31/02/2025</div>
                </div>
                <div className="change-type">Update</div>
            </div>

            <div className="item1">
                <div className="req-name">Move: Rating feature</div>
                <div className="owner">
                    <div className="owner-name">Karemera Patient</div>
                    <div className="on">authored on 20/05/2025</div>
                </div>
                <div className="change-type">Update</div>
            </div>

            <div className="item1">
                <div className="req-name">Spotify: Chatting Feature</div>
                <div className="owner">
                    <div className="owner-name">Tom Cruiz</div>
                    <div className="on">authored on 11/09/2024</div>
                </div>
                <div className="change-type">Update</div>
            </div>

            <div className="item1">
                <div className="req-name">Nike: Collaboration feature</div>
                <div className="owner">
                    <div className="owner-name">Tom Cruiz</div>
                    <div className="on">authored on 11/09/2024</div>
                </div>
                <div className="change-type">Update</div>
            </div>

            <div className="item1">
                <div className="req-name">Doormat: History feature</div>
                <div className="owner">
                    <div className="owner-name">Tom Cruiz</div>
                    <div className="on">authored on 11/09/2024</div>
                </div>
                <div className="change-type">Update</div>
            </div>

            <div className="item1">
                <div className="req-name">Shopping Cart: Messaging feature</div>
                <div className="owner">
                    <div className="owner-name">Karemera Patient</div>
                    <div className="on">authored on 11/09/2024</div>
                </div>
                <div className="change-type">Update</div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Reports