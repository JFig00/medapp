import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { auth } from './Firebase'
import Loader from 'react-loaders'
import { Toast, ToastContainer } from "react-bootstrap";


function Content() {
  let [module, setModule] = useState(null)
  let [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  /*
        Get request to get all collections
    */
  let getModule = () => {
    axios
      .get('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/request')
      .then(function (response) {
        // handle success
        setError(false)
        setModule(response.data.sort())
        console.log(response.data)
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

  /*
    Adds module to user
  */
  let addModule = (e) => {
    e.preventDefault()
    console.log(e.target.innerText)

    console.log(auth.currentUser.uid)

    axios
      .get('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user/' + auth.currentUser.uid)
      .then(function (response) {
        // handle success
        setError(false)

        let enrolled = response.data.userCourses.includes(e.target.innerText)

        if (enrolled == true) {
          console.log('Enrolled')
          setMessage('Already Enrolled')
          setShow(true)
        } else {
          console.log('Not Enrolled')
          setMessage('Successfully Enrolled!')
          let addingCourses = response.data.userCourses
          addingCourses.push(e.target.innerText)
          let newCourses = addingCourses.toString()

          console.log(newCourses)

          axios
            .put('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user/' + auth.currentUser.uid, {
              userCourses: newCourses,
            })
            .then(function (response) {
              // handle success
              setError(false)
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
    getModule()
    
  }, [])

  return (
    <>
      <div>
        <div className="otext text-center">
          <h3 className="contentt font-weight-bold text-uppercase">
            <i className="bi bi-bookmark-star"></i> Add Courses
          </h3>
          <p className="ctitle">
            Clicking on the course will add it to your My Courses.
          </p>
        </div>
        {error && (
          <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
        )}
        {message && message.length > 0 && (
          <ToastContainer className="position-absolute bottom-0 end-0 p-3">
            <Toast
              onClose={() => setShow(false)}
              show={show}
              delay={3500}
              autohide
            >
              <Toast.Body>{message}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}
        <div>
          {module && (!module.length || module.length === 0) && (
            <p>No results found</p>
          )}
          {module && module.length > 0 && (
            <>
              {module.map((myCourse) => {
                return (
                  <div className="ccont btn-group" key={myCourse}>
                    <div
                      className="border-0"
                      style={{ width: "13rem", cursor: "pointer" }}
                      onClick={addModule}
                    >
                      {myCourse}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
      <Loader type="pacman" />
    </>
  );
}

export default Content
