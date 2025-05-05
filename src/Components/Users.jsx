import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import './Users.css'

const Users = () => {
  return (
    <div className="box-body">
        <div className="add-user">
            <button className='btn-add-user'>Add User</button>
            <span className='user-count'>100 Users</span>
        </div>
        <div className="content">
          <div className="user">
            <div className="user-name">Mucyo Mwiza</div>
            <div className="user-type">
              <span className='info'>Approver</span>
              <div className="btns">
                  <select className='btn-type' >
                    <option value="developer">Developer</option>
                    <option value="developer">Approver</option>
                    <option value="developer">Admin</option>
                  </select>
                  <button className='btn-remove'>Remove</button>
              </div>
            </div>
          </div>

            <div className="user">
                <div className="user-name">Mucyo Mwiza</div>
                <div className="user-type">
                <span className='info'>Approver</span>
                <div className="btns">
                    <select className='btn-type' value={"Change Type"}>
                        <option value="developer">Developer</option>
                        <option value="developer">Approver</option>
                        <option value="developer">Admin</option>
                    </select>
                    <button className='btn-remove'>Remove</button>
                </div>
                </div>
            </div>

            <div className="user">
                <div className="user-name">Mucyo Mwiza</div>
                <div className="user-type">
                <span className='info'>Approver</span>
                <div className="btns">
                    <select className='btn-type' value={"Change Type"}>
                        <option value="developer">Developer</option>
                        <option value="developer">Approver</option>
                        <option value="developer">Admin</option>
                    </select>
                    <button className='btn-remove'>Remove</button>
                </div>
                </div>
            </div>

            <div className="user">
                <div className="user-name">Mucyo Mwiza</div>
                <div className="user-type">
                <span className='info'>Approver</span>
                <div className="btns">
                    <select className='btn-type' value={"Change Type"}>
                        <option value="developer">Developer</option>
                        <option value="developer">Approver</option>
                        <option value="developer">Admin</option>
                    </select>
                    <button className='btn-remove'>Remove</button>
                </div>
                </div>
            </div>

            <div className="user">
                <div className="user-name">Mucyo Mwiza</div>
                <div className="user-type">
                <span className='info'>Approver</span>
                <div className="btns">
                    <select className='btn-type' value={"Change Type"}>
                        <option value="developer">Developer</option>
                        <option value="developer">Approver</option>
                        <option value="developer">Admin</option>
                    </select>
                    <button className='btn-remove'>Remove</button>
                </div>
                </div>
            </div>

            <div className="user">
                <div className="user-name">Mucyo Mwiza</div>
                <div className="user-type">
                <span className='info'>Approver</span>
                <div className="btns">
                    <select className='btn-type' value={"Change Type"}>
                        <option value="developer">Developer</option>
                        <option value="developer">Approver</option>
                        <option value="developer">Admin</option>
                    </select>
                    <button className='btn-remove'>Remove</button>
                </div>
                </div>
            </div>
            
        </div>
        
    </div>
    
  )
}

export default Users