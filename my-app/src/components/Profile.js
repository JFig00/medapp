import { Card, Container, Row, Col, Form, Button, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState,useEffect } from 'react'
import { auth } from './Firebase'
import Loader from 'react-loaders'
import axios from 'axios'
import { Toast, ToastContainer } from "react-bootstrap";
import { Link } from 'react-router-dom'

function Profile() {
  let [data, setData] = useState(null)
  let [userName, setUserName] = useState("")
  let [message, setMessage]= useState(null)
  const [selectedImage, setImage] = useState(null)
  const [show, setShow] = useState(false)
  const [error, setError] = useState(null)

  let gettingInfo = () =>{
    setMessage(null)
    axios
      .get('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user/' + auth.currentUser.uid)
      .then(function (response) {
        // handle success
        setData(response.data)
  
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
  let updateUsername = (e) =>{
    e.preventDefault()
  
    if (userName === ""){
      setMessage("Error: Must enter a display name")
      setShow(true)
    }
    else{
      axios
        .put('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user/' + auth.currentUser.uid, {
          displayName: userName

        })
        .then(function (response) {
          // handle success
          setError(false)
          gettingInfo()
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
    
  }
  let updatePicture = (e) => {
    e.preventDefault()
    console.log(e.target.files[0])
    setImage(e.target.files[0])
    
    /*
    axios
      .put('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user/' + auth.currentUser.uid, {
        profilePicture: selectedImage,
      })
      .then(function (response) {
        // handle success
        setError(false)
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
    */
  }
  
  useEffect(() => {
    gettingInfo()
  }, [])
  return (
    <>
      {data && (
        <>
          <div className="profilebg">
            <Container className="profiles mb-3">
              <Row>
                <Col md={4}>
                  <Card className="imageup">
                    <span className="span rounded-top">
                      <Card.Body>
                        <div className="inputfile">
                          <div>
                            {selectedImage && (
                              <div>
                                <Image
                                  className="image"
                                  alt="not found"
                                  style={{
                                    height: "170px",
                                    width: "170px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                  }}
                                  src={URL.createObjectURL(selectedImage)}
                                />
                                <br />
                              </div>
                            )}
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/3870/3870822.png "
                              alt=""
                            />
                            <input
                              type="file"
                              id="file"
                              onChange={updatePicture}
                            />
                          </div>
                        </div>
                        <h3 className="h3">{data.displayName}</h3>
                      </Card.Body>
                    </span>
                  </Card>
                  <Row>
                    <Col xs={12}>
                      <Card className="stats">
                        <Card.Subtitle className="badges">
                          Total badges
                        </Card.Subtitle>
                        <Card.Body>
                          <Card.Subtitle className="badges">
                            {data.badges.length}
                          </Card.Subtitle>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col className="profile">
                  <Card className="b">
                    <h2 className="titles">Profile</h2>
                    <hr className="hr" />
                    <Form className="p-1">
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          className="form"
                          type="email"
                          disabled={true}
                          placeholder={auth.currentUser.email}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridUsername">
                        <Form.Label>Display Name</Form.Label>
                        <Form.Control
                          className="form"
                          type="username"
                          value={userName}
                          placeholder={`${data.displayName}`}
                          onChange={(e) => {
                            setUserName(e.target.value);
                          }}
                        />
                      </Form.Group>

                      <Button
                        className="button2"
                        variant="primary"
                        type="submit"
                        onClick={updateUsername}
                      >
                        Update
                      </Button>

                      <div className="changepass">
                        <Link to="/forgotPassword">Change Password</Link>
                      </div>
                    </Form>
                  </Card>
                  {message && (
                    <>
                      <ToastContainer className="position-absolute bottom-5 end-10 p-10">
                        <Toast
                          onClose={() => setShow(false)}
                          show={show}
                          delay={3500}
                          autohide
                        >
                          <Toast.Body>{message}</Toast.Body>
                        </Toast>
                      </ToastContainer>
                    </>
                  )}
                </Col>

                <Col md={3}>
                  <Card className="notif">
                    <Card.Body>
                      <Card.Title className="d-flex text-align-center">
                        Notifications
                      </Card.Title>
                      <hr className="hr" />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
          <Loader type="pacman" />
        </>
      )}
    </>
  );
}

export default Profile
