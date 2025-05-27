import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './LogIn.css'
import axios from 'axios';

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

  const from = location.state?.from?.pathname;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {email, password},
        {withCredentials: true}
      );
      const redirectPath = response.data.redirectPath;
      const userType = response.data.user.user_type;

      sessionStorage.setItem('user', JSON.stringify({
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        user_type: response.data.user.user_type,
        status: response.data.user.status
      }));
      
      if (from && isAllowedPath(from, userType)) {
        navigate(from, { replace: true });
      } else if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate(getRoleBasedRedirect(userType), { replace: true });
      }
      
    } catch (error) {
      console.error('Login error:', error);

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

  const isAllowedPath = (path, userType) => {
    const rolePermissions = {
      'ADMIN': ['/dashboard/admin'],
      'DEVELOPER': ['/dashboard/developer'],
      'APPROVER': ['/dashboard/approver'],
    };

    return rolePermissions[userType]?.some(allowedPath =>
      path.startsWith(allowedPath)
    ) || false;
  }

  const getRoleBasedRedirect = (userType) => {
    switch (userType) {
      case 'ADMIN':
        return '/dashboard/admin';
      
      case 'DEVELOPER':
        return '/dashboard/developer';

      case 'APPROVER':
        return '/dashboard/approver';

      default:
        return '/dashboard';
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