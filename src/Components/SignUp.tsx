import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios';

/**
 * SignUp component handles user registration for the Change Request Tracking System.
 *
 * - Renders a registration form for new users to create an account.
 * - Submits user details to the backend API and processes the response.
 * - Provides form validation and error handling.
 * - Redirects to login page upon successful registration.
 * - Displays loading state and error messages for failed registration attempts.
 *
 * @component
 * @returns The rendered signup form and related UI.
 */
const SignUp = () => {
  interface SignUpResponse {
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
      user_type?: string;
      status?: string;
    }
  }

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  /**
   * Handle input changes and update form state
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validate form data before submission
   * @returns boolean indicating if form is valid
   */
  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  /**
   * Handle form submission and user registration
   * @param e - Form submission event
   */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form before making API call
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post<SignUpResponse>(
        "/auth/signup",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password
        }
      );

      // Show success message and redirect to login
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Clear form data
      setFormData({
        username: '',
        email: '',
        password: ''
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (error: any) {
      console.error('Signup error:', error);

      // Handle different types of errors gracefully
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Registration failed';
        setError(errorMessage);
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred');
      }      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className="auth-box">
        <h2>SIGN UP</h2>
        <form>
          <input 
            className="input-field" 
            type="text" 
            name="username"
            value={formData.username}
            placeholder='Enter your user name' 
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        
          <input 
            className="input-field" 
            type="email" 
            name="email"
            value={formData.email}
            placeholder='Enter your email' 
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        
          <input 
            className="input-field" 
            type="password" 
            name="password"
            value={formData.password}
            placeholder='Enter Password' 
            onChange={handleInputChange}
            required
            disabled={loading}
            minLength={6}
          />
          
          <button 
            className='btn' 
            type='submit'
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Display error messages */}
          {error && <p className='error'>{error}</p>}
          
        {/* Display success messages */}
        {success && <p className='success'>{success}</p>}

        <p className='other'>Already have an account? <Link to={'/'}>Log In</Link></p>
      </div>
    </div>
  )
}

export default SignUp