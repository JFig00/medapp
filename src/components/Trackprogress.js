import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { auth } from './Firebase'
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  CardGroup,
  Table,
} from 'react-bootstrap'
import Loader from 'react-loaders'



function Trackprogress() {
  let [data, setData] = useState(null)
  let [badges, setBadges] = useState(null)
  let [courses, setCourses]= useState(null)
  let [isCompleted, setIsCompleted]= useState(null)
  const [error, setError] = useState(null)

  let showLeaderBoard = () => {
    axios
      .get('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user')
      .then(function (response) {
        // handle success
        var pointValue = response.data.slice(0);
        pointValue.sort(function(a,b) {
            return b.points - a.points;
        });
        setData(pointValue)
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

  let currentInfo = () =>{
    axios
      .get('http://ec2-3-82-106-234.compute-1.amazonaws.com:5678/user/' + auth.currentUser.uid)
      .then(function (response) {
        // handle success
        setBadges(response.data.badges.sort())
        setCourses(response.data.userCourses.sort())
        
        let determineCompletion = []
        for (let i = 0; i <response.data.badges.length; i++){
          let theString =  response.data.badges[i]
          let tempValue = theString.substring(0,theString.indexOf(' Expert')) || theString.substring(0,theString.indexOf(' Proficient')) || theString.substring(0,theString.indexOf(' Beginner'))|| theString.substring(0,theString.indexOf(' Novice'))

          determineCompletion.push(tempValue)
        }
        
        setIsCompleted(determineCompletion)
        
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
    showLeaderBoard()
    currentInfo()
  }, [])
  return (
    <>
      <Tabs
        defaultActiveKey="track"
        id="uncontrolled-tab-example"
        className="tabs"
      >
        <Tab eventKey="track" title="Track Progress">
          <h4 className="tp2">Current Progress</h4>
          <div className="bg2 container">
            <Row>
              <Col md={6}>
                <Container className="pro1">
                  <Table className="table">
                    <thead class="badgec">
                      <tr>
                        <th>Badges</th>
                      </tr>
                    </thead>

                    {badges && badges.length > 0 && (
                      <>
                        <tbody>
                          {badges.map((badge) => {
                            return (
                              <tr key={badge}>
                                <td>{badge} Badge</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </>
                    )}
                  </Table>
                </Container>
              </Col>
              <Col md={6}>
                <Container className="pro">
                  <Table className="tablet">
                    <thead>
                      <tr>
                        <th class="coursec">Courses</th>
                      </tr>
                    </thead>
                    {courses && courses.length > 0 && (
                      <>
                        <tbody>
                          {isCompleted &&
                            courses.map((courses) => {
                              return (
                                <tr className="top" key={courses}>
                                  <td>{courses}:</td>

                                  <td className="fixedw">
                                    {isCompleted.includes(courses)
                                      ? "Completed"
                                      : "Not Completed"}
                                  </td>
                                  <td className="fixedw"></td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </>
                    )}
                  </Table>
                </Container>
              </Col>
            </Row>
          </div>
        </Tab>
        <Tab eventKey="leaderboard" title="Leaderboard">
          {" "}
          <Container>
            <h3 className="titles2">
              Leaderboard<i class="bi-trophy-fill"></i>
            </h3>
            {data && data.length > 0 && (
              <>
                <Table className="table">
                  <thead class="theadt">
                    <tr>
                      <th>Rank</th>
                      <th>Username</th>
                      <th>Points</th>
                      <th>Badges</th>
                    </tr>
                  </thead>
                
                    <tbody class="tbodys">
                    {data.map((student, i) => {
                      i += 1;
                      return (
                        <tr
                          className="top"
                          key={student._id}
                          style={
                            i == 1
                              ? {
                                  color: " white ",
                                  backgroundColor: "rgb(60, 167, 239)",
                                  fontSize: "20px",
                                }
                              : i == 2
                              ? {
                                  backgroundColor: "rgb(255, 213, 74)",
                                  fontSize: "18px",
                                }
                              : {}
                          }
                        >
                          <td>{i}</td>
                          <td>{student.displayName}</td>
                          <td>{student.points}</td>
                          <td>{student.badges.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </>
            )}
          </Container>
        </Tab>
      </Tabs>
      <Loader type="pacman" />
    </>
  );
}

export default Trackprogress
