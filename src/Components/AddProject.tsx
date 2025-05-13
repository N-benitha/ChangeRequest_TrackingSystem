import axios from 'axios';
import React, { useState } from 'react'
import './AddProject.css'

const AddProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
            `http://localhost:3000/project/create`,
            {
                title: title,
                description: description
            });

            setTitle('');
            setDescription('');
            console.log('Project created');
            
            
        } catch (error) {
            setError(error)
            console.error("User wasn't created", error);
        }
    }

  return (
    <div className="project-container">
      <form onSubmit={handleSubmit}>
        <h2>New Project</h2>
        <div className="form-content">
          <div className="form-content-item">
            <p>Title:</p>
            <input type="text" className='project-text' placeholder='Enter Title' onChange={(e) => setTitle(e.target.value)}/>
          </div>

          <div className="form-content-item">
            <p>Description:</p>
            <textarea name="description" className='project-text' placeholder='Enter Description' cols={60} rows={5} onChange={(e) => setDescription(e.target.value)}/>
          </div>

          <button type="submit" className='btn-1'>Save Changes</button>

        </div>          

      </form>

    </div>
  )
}

export default AddProject