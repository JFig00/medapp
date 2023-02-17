import { useAuthValue } from './AuthContext'
import {
  useState,
 useEffect
} from 'react'
import { auth } from './Firebase'
import { sendEmailVerification} from 'firebase/auth'
import Loader from 'react-loaders'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

function VerifyEmail() {
  const navigate = useNavigate()
  const { currentUser } = useAuthValue()
  const [time, setTime] = useState(60)
  const { timeActive, setTimeActive } = useAuthValue()
  const [error, setError] = useState('')

  const [points, setPoints] = useState(0)
  const [userID, setuserID] = useState('')
  const [userCourses, setuserCourses] = useState('')
  const [badges, setBadges] = useState('')
  const [displayName, setdisplayName] = useState('')
  const [profilePicture, setprofilePicture] = useState('')

  let makeProfile = () =>{
    console.log(auth.currentUser.uid)
    console.log(auth.currentUser.displayName)
    axios
      .post('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user', {
        points: 0,
        userID: auth.currentUser.uid,
        userCourses: userCourses.split(""),
        displayName: auth.currentUser.displayName,
        profilePicture: null,
        badges:badges.split(""),
        owner: "false",
        admin: "false"
      })
      .then(function (response) {
        // handle success
        console.log('success')
        setPoints(0)
        setuserID('')
        setuserCourses('')
        setdisplayName('')
        setBadges('')
        setprofilePicture('')
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
  }
  useEffect(() => {
    if (currentUser?.emailVerified) {
      makeProfile()
      navigate('/Profile')
    }
  })
        

  const resendEmailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setTimeActive(true)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  return (
    <>
      <div className='login-page'>
        <div className='bg-image'></div>
        <div className='login-container'>
          <h1>Verify your Email Address</h1>
          <p>
            <strong>A Verification email has been sent to:</strong>
            <br />
            <span>{currentUser?.email}</span>
          </p>
          <span>
            Follow the instruction in the email to verify your account
          </span>
          <button onClick={resendEmailVerification} disabled={timeActive}>
            Resend Email {timeActive && time}
          </button>
        </div>
      </div>
      <Loader type='pacman' />
    </>
  )
}

export default VerifyEmail
