import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='auth-container'>
          <div className="auth-box">
            <h2>SIGN UP</h2>
            <form>
            <input className="input-field" type="text" placeholder='Enter your user name' required/>
              <input className="input-field" type="email" placeholder='Enter your email' required/>
              <input className="input-field" type="password" placeholder='Enter Password' required/>
              <button className='btn' type='submit'>Sign Up</button>
            </form>
            <p>Already have an account? <Link to={'/'}>Log In</Link></p>
          </div>
        </div>
  )
}

export default SignUp