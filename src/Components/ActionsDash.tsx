import React from 'react'
import './ActionsDash.css'

const ActionsDash = () => {
  return (
    <>
      <div className="action-container">
        <button className='btn-add-request'>ADD REQUEST</button>

        <form>
          <h2>New Request</h2>
          <div className="form-content">
            <div className="form-content-item">
              <p>Title</p>
              <input type="text" name="" id="" className='title'/>
            </div>

            <div className="form-content-item">
              <p>Request Type</p>
              <select name='change-type' id='change-type' className='change-type'>
                <option value="1">New Feature</option>
                <option value="2">Edited Feature</option>
                <option value="3">Bug Fix</option>
                <option value="4">Updates</option>
              </select>
            </div>

            <div className="form-content-item">
              <p>Description</p>
              <textarea name="description" className="description" cols={60} rows={5}></textarea>
            </div>

            <div className="form-content-item">
              <p>Deployment date</p>
              <input type='date' className='date'/>
            </div>

            <div className="form-buttons">
              <button className='btn-1'>Draft</button>
              <button className='btn-1'>Request</button>
            </div>

          </div>          

        </form>

      </div>
    </>
  )
}

export default ActionsDash