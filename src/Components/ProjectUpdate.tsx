import React, { useEffect, useState } from 'react'
import './ProjectUpdate.css'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const ProjectUpdate = () => {
    interface Project {
        id: string;
        title: string;
        description: string;
    }
    
    const [project, setProject] = useState<Project | null>(null);
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const { id: projectId } = useParams(); // ✅ Get id from URL parameters

    useEffect(() => {
        if (!projectId) {
            setError("Project ID not found");
            setLoading(false);
            return;
        }

        const fetchProject = async () => {
            try {
                console.log("Fetching project with ID:", projectId);
                const response = await api.get(`/project/${projectId}`);
                const projectData = response.data;
                
                setProject(projectData);
                setProjectTitle(projectData.title);
                setProjectDescription(projectData.description);
                setError(''); // Clear any previous errors
                
            } catch (error) {
                console.error("Failed to fetch project:", error);
                setError("Failed to load project data");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!projectTitle.trim()) {
            setError("Project title is required");
            return;
        }
        
        if (!projectDescription.trim()) {
            setError("Project description is required");
            return;
        }

        setSaving(true);
        setError('');

        try {
            console.log("Updating project:", projectId);
            await api.patch(`/project/${projectId}`, {
                title: projectTitle.trim(),
                description: projectDescription.trim()
            });
            
            alert('Project updated successfully!');
            console.log('Project Updated');
            
            // Navigate back to projects list
            navigate('../');
            
        } catch (error) {
            console.error('Failed to update project:', error);
            
            // Better error handling
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to update project. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    }

    // ✅ Fixed missing return statement
    if (loading) return <div className="loading">Loading project data...</div>;

    if (error && !project) {
        return (
            <div className="error-container">
                <div className="error-message">Error: {error}</div>
                <button onClick={() => navigate('../')} className="btn-back">
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <div className="project-container">
            <form onSubmit={handleSubmit}>
                <h2>Update Project Information</h2>
                
                {error && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}
                
                <div className="form-content">
                    <div className="form-content-item">
                        <p>
                            Current Title: 
                            <strong style={{color: 'white', paddingLeft: '10px'}}>
                                {project?.title}
                            </strong>
                        </p>
                        <input 
                            type="text" 
                            className='project-text' 
                            placeholder='Enter new project title'
                            value={projectTitle} // ✅ Added value prop for controlled input
                            onChange={(e) => setProjectTitle(e.target.value)}
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className="form-content-item">
                        <p>Description:</p>
                        <textarea 
                            name="description" 
                            className='project-text' 
                            value={projectDescription}
                            placeholder="Enter project description"
                            cols={60} 
                            rows={5} 
                            onChange={(e) => setProjectDescription(e.target.value)}
                            disabled={saving}
                            required
                        />
                    </div>

                    <div className="form-buttons">
                        <button 
                            type="submit" 
                            className='btn-1'
                            disabled={saving || !projectTitle.trim() || !projectDescription.trim()}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        
                        <button 
                            type="button" 
                            className='btn-cancel'
                            onClick={() => navigate('../')}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                </div>          
            </form>
        </div>
    )
}

export default ProjectUpdate