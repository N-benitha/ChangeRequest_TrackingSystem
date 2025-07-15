import axios from 'axios';
import api from '../../../api/axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './css/AddProject.css'

/**
 * AddProject component provides a form for creating a new project.
 *
 * @component
 * @returns The rendered AddProject form component.
 *
 * @description
 * - Allows users to input a project title and description.
 * - Handles form submission with validation and loading state.
 * - Displays error messages for invalid input or failed API requests.
 * - On successful creation, resets the form and navigates back to the previous page.
 *
 */
const AddProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Handles form submission for creating a new project
     * Validates input fields and makes API call to create project
     * @param e - Form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation to ensure required fields are filled
        if (!title.trim() || !description.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log("Creating project with:", { title, description });
            
            // Create new project
            const response = await api.post('/project/create', {
                title: title.trim(),
                description: description.trim()
            });

            console.log('Project created successfully:', response.data);
            
            // Clear fields
            setTitle('');
            setDescription('');
            
            alert('Project created successfully!');
            navigate('../');
            
        } catch (error) {
            console.error("Failed to create project:", error);
            
             // Handle different error scenarios
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to create project. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="project-container">            
            <form onSubmit={handleSubmit}>
                <h2>New Project</h2>
                
                {error && (
                    <div className="error-message" style={{ 
                        color: 'red', 
                        backgroundColor: 'rgba(255,0,0,0.1)', 
                        padding: '10px', 
                        marginBottom: '15px',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </div>
                )}
                
                <div className="form-content">
                    <div className="form-content-item">
                        <p>Title:</p>
                        <input 
                            type="text" 
                            className='project-text' 
                            placeholder='Enter Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-content-item">
                        <p>Description:</p>
                        <textarea 
                            name="description" 
                            className='project-text' 
                            placeholder='Enter Description' 
                            cols={60} 
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <button 
                            type="submit" 
                            className='btn-1'
                            disabled={loading || !title.trim() || !description.trim()}
                        >
                            {loading ? 'Creating...' : 'Save Changes'}
                        </button>
                        
                        <button 
                            type="button" 
                            className='btn-cancel'
                            onClick={() => navigate('../')}
                            disabled={loading}
                            style={{
                                marginLeft: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>          
            </form>
        </div>
    )
}

export default AddProject