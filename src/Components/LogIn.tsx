import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './LogIn.css'
import api from '../api/axios';

/**
 * LogIn component handles user authentication for the application.
 *
 * - Renders a login form for users to enter their email and password.
 * - Submits credentials to the backend API and processes the response.
 * - Stores user information in sessionStorage upon successful login.
 * - Redirects users based on their role or previous navigation intent.
 * - Displays loading state and error messages for failed login attempts.
 *
 * @component
 * @returns The rendered login form and related UI.
 *
 */
const LogIn = () => {
  interface User {
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
      user_type: string;
      status: string;
    }
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

    // Capture the route user was trying to access before being redirected to login
  const from = location.state?.from?.pathname;

  /**
   * Handle form submission and user authentication
   * @param e - Form submission event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post(
        "/auth/login",
        {email, password}
      );
      const redirectPath = response.data.redirectPath;
      const userType = response.data.user.user_type;

      // Store user data in sessionStorage for client-side access throughout the session
      sessionStorage.setItem('user', JSON.stringify({
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        user_type: response.data.user.user_type,
        status: response.data.user.status
      }));
      
       // Smart navigation: prioritize user's original destination if allowed for their role
      if (from && isAllowedPath(from, userType)) {
        navigate(from, { replace: true });
      } else if (redirectPath) {
        // Use backend-provided redirect path
        navigate(redirectPath, { replace: true });
      } else {
        // Fallback to role-based default dashboards
        navigate(getRoleBasedRedirect(userType), { replace: true });
      }
      
    } catch (error) {
      console.error('Login error:', error);

      // Handle different types of errors gracefully
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Login failed';
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occured');
      }      
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if a user's role has permission to access a specific path
   * @param path - The path the user was trying to access
   * @param userType - The user's role type
   * @returns boolean indicating if access is allowed
   */
  const isAllowedPath = (path, userType) => {
    const rolePermissions = {
      'ADMIN': ['/dashboards/admin'],
      'DEVELOPER': ['/dashboards/developer'],
      'APPROVER': ['/dashboards/approver'],
    };

    return rolePermissions[userType]?.some(allowedPath =>
      path.startsWith(allowedPath)
    ) || false;
  }

  /**
   * Get the default dashboard route based on user role
   * @param userType - The user's role type
   * @returns string path to the appropriate dashboard
   */
  const getRoleBasedRedirect = (userType) => {
    switch (userType) {
      case 'ADMIN':
        return '/dashboards/admin';
      
      case 'DEVELOPER':
        return '/dashboards/developer';

      case 'APPROVER':
        return '/dashboards/approver';

      default:
        return '/dashboards';
    }
  };

  return (
    <div className='auth-container'>
          <div className="auth-box">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input 
              className="input-field" 
              type="email" 
              value={email}
              placeholder='Username or Email'
              onChange={(e) => setEmail(e.target.value)} 
              required
              disabled={loading}
              />

              <input 
              className="input-field" 
              type="password"
              value={password} 
              placeholder='Password' 
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              />

              <button 
              className='btn' 
              type='submit'
              disabled={loading}>
                {loading ? 'Logging In...' : 'Log In'}
              </button>

            </form>
            {error && <p className='error'>Wrong Credentials</p>}
            
            <p className='other'>Don't have an account? <Link to={'/signup'}>Sign Up</Link></p>
          </div>
        </div>
  )
}

export default LogIn