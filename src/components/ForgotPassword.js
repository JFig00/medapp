import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from './Firebase'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  // const emailRef = useRef();
  const [email, setEmail] = useState()
  const navigate = useNavigate()

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await resetPassword(email)
      alert(`Reset Password Email Sent to ${email}`)
      navigate('/login')
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <>
      <div className='login-page'>
        <div className='bg-image'></div>
        <div className='login-container'>
          <h1>Reset Password</h1>
          {/* login form  */}
          <form onSubmit={handleSubmit}>
            <div className='loginwithemail'>
              <label>
                <h4>
                  <strong>Email</strong>
                </h4>
              </label>
              <input
                type='email'
                value={email}
                placeholder='Enter your email'
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <EmailField {...{ emailRef }}/> */}
              <button className='button'>Send Email</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
