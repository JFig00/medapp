import { useState, useEffect } from 'react'
import { AuthProvider } from './components/AuthContext'
import { auth } from './components/Firebase'
import { onAuthStateChanged } from 'firebase/auth'
// import ProtectedRoute from './components/ProtectedRoute'
import { Navigate } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

//Pages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import VerifyEmail from './components/VerifyEmail'
import Home from './components/Home/Home'
import Trackprogress from './components/Trackprogress'
import Profile from './components/Profile'
import Courses from './components/Courses'
import Content from './components/Content'
import Login from './components/Login'
import Admin from './components/Admin'
import Organizer from './components/Organizer'
import Navb from './components/Navb/Navb'
// import Account from './components/Account'
import Register from './components/Signup'
import PrivateRoute from './components/PrivateRoute'
import About from './components/About/About'
import ForgotPassword from './components/ForgotPassword'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)

 
  useEffect(() => {
    
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    
  }, [])
  return (
    <Router>
      <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
        <Navb>
          <Routes>
            <Route
              exact
              path="/"
              element={
                !currentUser?.emailVerified ? (
                  <Home />
                ) : (
                  <Navigate to="/Profile" />
                )
              }
            />
            {auth?.currentUser ? (
              <>
                <Route path="/Organizer" exact element={<Organizer />} />
                <Route path="/Admin" exact element={<Admin />} />
                <Route path="/Profile" exact element={<Profile />} />
                <Route path="/Courses" exact element={<Courses />} />
                <Route path="/Content" exact element={<Content />} />
                <Route
                  path="/Trackprogress"
                  exact
                  element={<Trackprogress />}
                />
                <Route path="/verify-email" exact element={<VerifyEmail />} />
                <Route
                  path="/forgotPassword"
                  exact
                  element={<ForgotPassword />}
                />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/" />} />
                <Route path="/Login" exact element={<Login />} />
                <Route path="/register" exact element={<Register />} />
                <Route
                  path="/forgotPassword"
                  exact
                  element={<ForgotPassword />}
                />
                {/* <Route path='/Home' exact element={<Home/>} /> */}
                <Route path="/About" exact element={<About />} />
              </>
            )}
            {/* <Route path='/protected' exact element={<PrivateRoute/>}/> */}
          </Routes>
        </Navb>
      </AuthProvider>
    </Router>
  );
}

export default App
