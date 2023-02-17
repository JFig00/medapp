import { useState } from 'react'
import { auth } from './Firebase'
import { useNavigate, Link } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification, updateProfile
} from 'firebase/auth'
import { useAuthValue } from './AuthContext'

function Register() {
  const [fName, setFname] = useState('')
  const [lName, setLname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setTimeActive } = useAuthValue()

  const validatePassword = () => {
    let isValid = true
    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      }
    }
    return isValid
  }

  const register = (e) => {
    e.preventDefault()
    setError('')
    let displayName = fName + " " + lName

    if (validatePassword()) {
      // Create a new user with email and password using firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          updateProfile(auth.currentUser,{
            displayName: displayName
          })
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true)
              navigate('/verify-email')
          })
          
        })
        .catch((err) => setError(err.message))
    }
    setFname('')
    setLname('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="login-page">
      <div className="bg-image"></div>
      <div className="login-container">
        <h1>Register</h1>
        {error && <div className="errorc"> {error}</div>}
        <form
          onSubmit={register}
          name="registration_form"
          className="signupwithemail"
        >
          <label class="d-flex text-align-start">
            <strong>First Name</strong>
          </label>
          <input
            type="fName"
            value={fName}
            placeholder="Enter your first name"
            required
            onChange={(e) => setFname(e.target.value)}
          />
          <label class="d-flex text-align-start">
            <strong>Last Name</strong>
          </label>
          <input
            type="lName"
            value={lName}
            placeholder="Enter your last name"
            required
            onChange={(e) => setLname(e.target.value)}
          />
          <label class="d-flex text-align-start">
            <strong>Email</strong>
          </label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label class="d-flex text-align-start">
            <strong>Password</strong>
          </label>
          <input
            type="password"
            value={password}
            required
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label class="d-flex text-align-start">
            <strong>Re-enter Password</strong>
          </label>
          <input
            type="password"
            value={confirmPassword}
            required
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="button"> Register</button>
        </form>
        <span>
          Already have an account?
          <Link to="/Login">login</Link>
        </span>
      </div>
    </div>
  );
}

export default Register
