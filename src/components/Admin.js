import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { auth } from './Firebase'
import { Button, Modal } from "react-bootstrap"

function Admin() {
  let [data, setData] = useState(null)
  let [newTempData, setNewTempData] = useState(null)
  let [info, setInfo] = useState(null)
  let [filtered, setFilterd]= useState(null)
  let [isAdmin, setIsAdmin] = useState()
  let [adminStatus, setAdminStatus]  = useState()
  let [ownerStatus, setOwnerStatus] = useState()
  let [isOwner, setIsOwner]= useState()
  let [canEdit, setCanEdit] = useState()
  let [message, setMessage]= useState(null)
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false);
  let determineAccess = () =>{
    axios
      .get('localhost:5678/user/' + auth.currentUser.uid)
      .then(function (response) {
        // handle success
        setIsAdmin(response.data.admin)
        setIsOwner(response.data.owner)

        if (response.data.owner == "false"){
          setCanEdit(true)
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
  let users = () => {
    axios
      .get('localhost:5678/user')
      .then(function (response) {
        // handle success
        console.log(response.data)
        setData(response.data)
        setNewTempData(response.data)
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

  let editStatus = (e) =>{
    e.preventDefault()
    
    if ((adminStatus === "true" || adminStatus === "false") &&  (ownerStatus === "true" || ownerStatus === "false")){
      setMessage("Status Changed")
      axios
        .put('localhost:5678/user/' + info.userID, {
          owner: adminStatus,
          admin: ownerStatus
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
    else{
      setMessage("Make sure owner or input is either 'true' or 'false'")
    }
    
  }
  let userInfo = (e) => {
    e.preventDefault()
    setMessage(null)
    setShow(true)
    axios
      .get('localhost:5678/user/' + e.target.value)
      .then(function (response) {
        // handle success
        setInfo(response.data)
        setAdminStatus(response.data.admin)
        setOwnerStatus(response.data.owner)
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
  let filteredUsers = (e) => {
    e.preventDefault()
    if (e.target.value === ""){
      users()
    }
    else{
      console.log(newTempData)
      var filteredData = newTempData.filter(function (el)
        {
          return el.displayName.includes(e.target.value)
        }
      );
      setData(filteredData)
    }
    
  }
  
  useEffect(() => {
    users()
    determineAccess()
  }, [])
  return (
    <>
      {isAdmin === "true" && (
        <>
          <div className="ad container">
            <h3 className=""></h3>

            <form className="search">
              <input
                placeholder="Search for User"
                type="text"
                id="filtered"
                name="filtered"
                onChange={filteredUsers}
              />
            </form>
            {data && (
              <>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((student) => {
                        return (
                          <tr class="aduser btn-group" key={student._id}>
                            <td>
                              <div className="ucon container">
                                <i className="usi bi-person-circle"></i>
                                <button
                                  className="auser"
                                  value={student.userID}
                                  onClick={userInfo}
                                >
                                  {student.displayName}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Maybe make this Modal */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>User Information</Modal.Title>
              </Modal.Header>
              {info && (
                <>
                  <Modal.Body>
                    <div>
                      <h3>{info.displayName}</h3>

                      <form>
                        <label htmlFor="options">Admin</label>
                        <input
                          type="adminStatus"
                          id="adminStatus"
                          disabled={canEdit}
                          name="adminStatus"
                          value={adminStatus}
                          onChange={(e) => {
                            setAdminStatus(e.target.value);
                          }}
                        />

                        <label htmlFor="options">Owner</label>
                        <input
                          type="ownerStatus"
                          id="ownerStatus"
                          disabled={canEdit}
                          name="ownerStatus"
                          value={ownerStatus}
                          onChange={(e) => {
                            setOwnerStatus(e.target.value);
                          }}
                        />
                        <button
                          className="addquest"
                          disabled={canEdit}
                          onClick={editStatus}
                        >
                          Update
                        </button>
                        {message && <p>{message}</p>}
                      </form>
                      <p>Badges: {info.badges.sort().toString()}</p>
                      <p>Points: {info.points}</p>
                      <p>Courses: {info.userCourses.sort().toString()}</p>
                    </div>
                  </Modal.Body>
                  <br />
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal>
          </div>
        </>
      )}
      {isAdmin === "false" && (
        <>
          <p className="completed">You are not authorized to use this page</p>
        </>
      )}
    </>
  );
}

export default Admin;
