import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from './Firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { useAuthValue } from './AuthContext'
import axios from 'axios'
import Loader from 'react-loaders'

const provider = new GoogleAuthProvider()

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setTimeActive } = useAuthValue()

  /*
    User profile values
  */
  const [points, setPoints] = useState(0)
  const [userID, setuserID] = useState('')
  const [userCourses, setuserCourses] = useState('')
  const [badges, setBadges] = useState('')
  const [displayName, setdisplayName] = useState('')
  const [profilePicture, setprofilePicture] = useState('')

  /*
  useEffect(() => {
    if (auth?.currentUser) {
      navigate('/Profile')
    }
  }, [])
  */

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        //getting details from signed in account using google
        axios
          .post('localhost:5678/user', {
            points: 0,
            userID: result.user.uid,
            userCourses: userCourses.split(""),
            displayName: result.user.displayName,
            profilePicture: null,
            badges:badges.split(""),
            owner: "false",
            admin: "false"
          })
          .then(function () {
            // handle success

          })
          .catch(function (error) {
            // handle error
            if (error.response.status === 400) {
              console.log(error)
              setError('Cant find record')
            } else {
              setError('Unexpected Error')
            }
          })
          .then(function () {
            // always executed
          })
          navigate('/Profile')
      })
    
      .catch((error) => {
        console.log(error)
      })
  }

  const login = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Correct Login')
        console.log(auth.currentUser)
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true)
              navigate('/verify-email')
            })
            .catch((err) => alert(err.message))
        } else {
          
          axios
            .post('localhost:5678/user', {
              points: 0,
              userID: auth.currentUser.uid,
              userCourses: userCourses.split(""),
              displayName: auth.currentUser.displayName,
              profilePicture: null,
              badges:badges.split(""),
              owner: "false",
              admin: "false"
            })
            .then(function () {

            })
            .catch(function (error) {
              // handle error
              if (error.response.status === 400) {
                console.log(error)
                setError('Cant find record')
              } else {
                setError('Unexpected Error')
              }
            })
            .then(function () {
              // always executed
            })
            
          navigate('/Profile')
        }
      })
      .catch((err) => setError(err.message))
  }

  return (
    <>
      <div className='login-page'>
        <div className='bg-image'></div>
        <div className='login-container'>
          <h1>Sign In</h1>
          <>
            {/* login form  */}

            <div className='loginwithemail'>
              <label>
                <strong>Email</strong>
              </label>
              <input
                type='email'
                placeholder='Enter your email'
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>
                <strong>Password</strong>
              </label>
              <input
                type='password'
                placeholder='Enter your password'
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link to={'/forgotPassword'}>
                {' '}
                <p>Forgot Password?</p>
              </Link>
            </div>
            <button
              className='button btn-top-margin'
              type='submit'
              onClick={login}
            >
              Login
            </button>

            <div>
              {' '}
              <h4>OR</h4>
              <button
                className='login-with-google-btn'
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </button>
            </div>
            <div className='reSgister'>
              <p>
                <strong>Don't have an account?</strong>
              </p>
              <Link to='/register'>
                <button className='button'>Register</button>
              </Link>
            </div>
          </>
        </div>
      </div>
      <Loader type='pacman' />
    </>
  )
}
export default Login
