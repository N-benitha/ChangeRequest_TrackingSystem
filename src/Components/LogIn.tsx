import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LogIn.css'
import axios from 'axios';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {email, password},
        {withCredentials: true}
      ) 
      console.log(response.data);
      navigate('/dashboards');
      
    } catch (error) {
      console.error(error);
      setError(error)
      
    }
  }

  return (
    <div className='auth-container'>
          <div className="auth-box">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input 
              className="input-field" 
              type="email" 
              value={email}
              placeholder='Username'
              onChange={(e) => setEmail(e.target.value)} 
              required/>

              <input 
              className="input-field" 
              type="password"
              value={password} 
              placeholder='Password' 
              onChange={(e) => setPassword(e.target.value)}
              required/>

              <button className='btn' type='submit'>Log In</button>
            </form>
            {error && <p className='error'>Wrong Credentials</p>}
            <p className='other'>Don't have an account? <Link to={'/signup'}>Sign Up</Link></p>
          </div>
        </div>
  )
}

export default LogIn