import React from 'react'
import { Link } from 'react-router-dom'
import './LogIn.css'

const LogIn = () => {

    const handleLogin = () => {}

  return (
    <div className='auth-container'>
          <div className="auth-box">
            <h2>Login</h2>
            <form>
              <input className="input-field" type="email" placeholder='Username' required/>
              <input className="input-field" type="password" placeholder='Password' required/>
              <button className='btn' type='submit'>Log In</button>
            </form>
            <p>Don't have an account? <Link to={'/signup'}>Sign Up</Link></p>
          </div>
        </div>
  )
}

export default LogIn