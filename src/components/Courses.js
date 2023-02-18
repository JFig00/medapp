import { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Card } from 'react-bootstrap'
import { auth } from './Firebase'
import Loader from 'react-loaders'
import React from 'react'



//For multichoice questions
let choosingArray = []
let alreadyArray = []

//final report
let correctArray = []
let wrongArray = []

function Courses() {

  //Profile Variables
  let [badges, setBadges] = useState(null)
  let [points, setPoints] = useState(null)

  //Disabled Buttons
  let [isDisabled, setIsDisabled] = useState(true)
  let [isChoicesDisabled, setIsChoicesDisabled] = useState(false)
  let [data, setData] = useState(null)

  //getting next questions
  let [index, setIndex] = useState(0)
  let [course, setCourse] = useState(null)
  let [module, setModule] = useState(null)
  let [current, setCurrent] = useState(null)

  //Messages
  let [message, setMessage] = useState(null)
  let [counterMessage, setCounterMessage] = useState(false)
  let [questionMessage, setQuestionMessage] = useState(null)
  let [messageStyle,setMessageStyle]= useState(null)

  //For Matching
  let [options, setOptions] = useState(null)
  let [answers, setAnswers] = useState(null)
  let [matchCount, setMatchCount] = useState(null)

  //Final Report
  let [score, setScore] = useState(null)
  let [badgeReport, setBadgeReport] = useState(null)
  const [error, setError] = useState(null)

  /*
    Get request to get all collections
  */
  let getModule = () => {
    correctArray =[]
    wrongArray = []
    setScore(null)
    setIsDisabled(true)
    setIsChoicesDisabled(false)
    setData(null)
    setMatchCount(null)
    setQuestionMessage(null)
    setCurrent(null)
    setOptions(null)
    setAnswers(null)
    setMessage(null)
    setCounterMessage(false)
    setIndex(0)

    axios
      .get('localhost:5678/user/' + auth.currentUser.uid) 
      .then(function (response) {
        // handle success
        setError(false)
        setBadges(response.data.badges)
        setPoints(response.data.points)
        setModule(response.data.userCourses.sort())
       
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
    Starts the moodule by getting first question
  */
  let getQuestion = (e) => {
    e.preventDefault()
    setModule(null)
    setMessage(null)
    setCounterMessage(true)
    setMatchCount(null)
    setCourse(e.target.innerText)

    axios
      .get('localhost:5678/request/' + e.target.innerText)
      .then(function (response) {
        // handle success
        setError(false)
        setData(response.data)
        setCurrent(response.data[index])
        setOptions(shuffle(response.data[index].options))
        setAnswers(shuffle(response.data[index].answer))
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
    Handles button
  */
  
  function Button  (props) {
    
    const [isSelected, setIsSelected] = useState("test2");
    const [active, setActive] = useState(false);

    const handleClickButton = () => {
      questionHandler()
      
      setIsSelected("test2Selected");
      setActive(true);
      if (active === true) {
        setActive(false);
        setIsSelected("test2");
      }
    };

    let questionHandler = () =>{
      if (data[index].type === 'pick one'){
        if (props.name === data[index].answer[0]) {
          correctArray.push(index)
          setQuestionMessage("Correct!")
          setMessageStyle("messageCorrect")
          setPoints((points +=5))
          setIsDisabled(false)
          setIsChoicesDisabled(true)
      
        } else {
          wrongArray.push(index)
          setQuestionMessage('Sorry, that answer is incorrect.')
          setMessageStyle("messageWrong")
          setIsDisabled(false)
          setIsChoicesDisabled(true)
        }
      }
      if (data[index].type === 'multichoice'){
        choosingArray.push(props.name)
        if (choosingArray.length === data[index].answer.length){
          //checks if every element in choosingArry is in the answer array
          let findMatches = choosingArray.every( ai => data[index].answer.includes(ai) );
          if (findMatches === true){
            correctArray.push(index)
            setQuestionMessage("Correct!")
            setMessageStyle("messageCorrect")
            setPoints((points +=5))
            setIsDisabled(false)
            setIsChoicesDisabled(true)
            choosingArray = []
            } 
          else {
            wrongArray.push(index)
            setQuestionMessage('Sorry, that answer is incorrect.')
            setMessageStyle("messageWrong")
            setIsDisabled(false)
            setIsChoicesDisabled(true)
            choosingArray = []
          }
        }
      }
      if (data[index].type === 'matching'){
      
        if (props.value === "option"){
          let someValue = data[index].options.indexOf(props.name)
          choosingArray.push(someValue)  
        }
        if (props.value === "answer"){
          let someValue = data[index].answer.indexOf(props.name)
          choosingArray.push(someValue)
        }
        if (choosingArray.length === 2){
          
          if (choosingArray[0] === choosingArray[1]){
            let inArray = alreadyArray.includes(choosingArray[0])    
            if (inArray){
              setQuestionMessage("Already Matched these")     
              choosingArray = []
            }  
            if (!inArray){
              setQuestionMessage("Correct!")
              setMessageStyle("messageCorrect")
              setMatchCount(matchCount+=1)
              setPoints((points +=5))

              alreadyArray.push(choosingArray[0])
            
              choosingArray = []
            }
          }
          if (choosingArray[0] !== choosingArray[1]){
            setQuestionMessage('Sorry, that answer is incorrect.')
            setIsDisabled(false)
            setIsChoicesDisabled(true)
            wrongArray.push(index)
            setMessageStyle("messageWrong")
            
            choosingArray = []
          }
    
          if (matchCount === data[index].answer.length){
            correctArray.push(index)
            setIsDisabled(false)
            setIsChoicesDisabled(true)
            choosingArray = []
            alreadyArray = []
          } 
        } 
      }
    }
   
    return (
      <button
        className={`${isSelected}`}
        disabled = {isChoicesDisabled}
        onClick={() => handleClickButton(props.name)}
      >
        {props.name}
      </button>
    );
  };

  let nextQuestion = (e) => {
    e.preventDefault()
    setMatchCount(null)
    setIsChoicesDisabled(false)
    setIsDisabled(true)
    setQuestionMessage(null)
    setIndex((index += 1))
    
    if (index === data.length) {
      setIndex(index - 1)
      setMessage('Congrats! You have finished the module')
    
      setScore((parseInt(correctArray.length) / (parseInt(wrongArray.length) + parseInt(correctArray.length))  * 100).toFixed(2))

      let score = parseInt(correctArray.length) / (parseInt(wrongArray.length) + parseInt(correctArray.length))  * 100
      console.log(score)
      let settingBadge;
      if (score == 100){
        settingBadge = course + ' Expert Badge'
        setBadgeReport(settingBadge)
      }
      if (score < 100 && score >= 80){
        settingBadge = course + ' Advanced Badge'
        setBadgeReport(settingBadge)
      }
      if (score < 80 && score >= 60){
        settingBadge = course + ' Proficient Badge'
        setBadgeReport(settingBadge)
      }
      if (score < 60){
        settingBadge = course + ' Beginner Badge'
        setBadgeReport(settingBadge)
      }
      //determines if you already have the badge

      if (!badges.includes(settingBadge)){
        badges.push(settingBadge)
      }
      
      axios
        .put('localhost:5678/user/' + auth.currentUser.uid, {
          points: points,
          badges: badges
        })
        .then(function () {
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
        setCurrent(null)
        setOptions(null)
        setAnswers(null)
      
    }
    else{
      setCurrent(data[index])
      setOptions(shuffle(data[index].options))
      setAnswers(shuffle(data[index].answer))
      console.log(choosingArray)
      choosingArray = []
      console.log(choosingArray)
    }
  }
 
  /*
    Randomize the choices
  */
  const shuffle = arr => arr.map(a => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map(a => a.value);

  useEffect(() => {
    getModule()
  }, [])
 
  return (
    <>
      <div>
        {error && (
          <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
        )}
        <div>
          {module && (!module.length || module.length === 0) && (
            <p className="completed">
              Not Enrolled in any classes. Go to All Courses to Enroll
            </p>
          )}
          {module && module.length > 0 && (
            <>
              {module.map((myCourse) => {
                return (
                  <div
                    key={myCourse}
                    className="contc btn-group ml-auto mb-2 p-3 "
                  >
                  
                    <Card
                      className="border-0"
                      onClick={getQuestion}
                      style={{ width: "13rem", cursor: "pointer" }}
                    >
                      <Card.Body>
                        <div className="course" key={myCourse}>
                          <Card.Title className="mod">{myCourse}</Card.Title>
                          <hr className="line"></hr>
                          <label className="ap" onClick={getQuestion}></label>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </>
          )}

          {counterMessage && data && (
            <div>
              <div className="backcount">
                <button
                  className="back"
                  variant="outline-primary"
                  onClick={getModule}
                >
                  <div className="back bi bi-caret-left">
                    Back to My Courses
                  </div>
                </button>
                <p className="num">
                  {index + 1} out of {data.length}{" "}
                </p>
              </div>
            </div>
          )}

          {current && answers && options && data && (
            <>
              <div className="que container-fluid ">      
                <p className="qu">{current.question}</p>
                {current.type === "multichoice" && <p className="qu">Select all that apply</p>}
                {questionMessage && <p className={messageStyle}>{questionMessage}</p>}
                {current.type !== "matching" &&
                  options.map((theOptions, counter) => {
                    counter += 1;
                    return (
                      <div className="questions" key={counter}>
                        <Button
                          value={counter}
                          name = {theOptions}
                          
                        />   
                      </div>
                    );
                  })}
                {/* These are for matching */}

                <div className ="multir">
                  <div className ="multio">
                    {current.type === "matching" &&
                      options.map((theOptions) => {
                        return (
                          <div key={theOptions}>
                            <Button
                              value={"option"}
                              name = {theOptions}
                            />
                          </div>
                        );
                      })}
                  </div>
                  <p></p>
                  <div className="multio">
                    {current.type === "matching" &&
                      answers.map((theOptions) => {
                        return (
                          <div key={theOptions}>
                            <Button
                              value={"answer"}
                              name = {theOptions}
                             
                              />
                          </div>
                        );
                      })}
                  </div>
              
                </div>
                <button
                  disabled={isDisabled}
                  onClick={nextQuestion}
                  className="nextq"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {message && data && (
            <div className="content">
              <div className="completed">{message}</div>
              <p className="completed">You Earned: {badgeReport}</p>
              <p className="completed">Your score: {score}%</p>

              <div className="tablewrap table-responsive">
                <table className="table2 table">
                  <thead className="thead">
                    <tr>
                      <th> </th>
                      <th>Question</th>
                      <th>Answer(s)</th>
                      <th>Option(s)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((student,rowCounter) => {
                      rowCounter +=1
       
                      return (
                        <tr key={student._id}>
                          <td>{rowCounter}</td>
                          <td>{student.question}</td>
                          <td>{student.answer.toString().split(" ")}</td>
                          <td className="fixedw">
                            {student.options.toString().split(" ")}
                          </td>
                          <td className="fixedw">
                            
                          {correctArray.includes(rowCounter - 1)? "Correct" : "Not Correct"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Loader type="pacman" />
    </>
  );
}

export default Courses