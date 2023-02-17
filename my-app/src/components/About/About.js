import { useEffect, useState } from 'react'

import AnimatedLetters from '../../AnimatedLetters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss'

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)
  }, [])

  return (
    <>
      <div
        className="container about-page"
        style={{ background: "lightyellow", height: "100vh" }}
      >
        <div className="text-zone" style={{ top: "75%" }}>
          <h1 style={{ fontSize: "70px" }}>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={["", "", "A", "B", "O", "U", "T", " ", "U", "S"]}
              idx={15}
            />
          </h1>
          <h5>
            "Palmacology" was the vision of Dr. Lynne Palma who has over 20
            years of experience teaching pharmacology. With the help of senior
            students at Florida Atlantic University Department of Electrical
            Engineering and Computer Science, this application came to life to
            help learners engage in the study of drugs. Prescribing and
            administering medication requires a tremendous knowledge base and
            awareness of drug classes, FDA black box warnings, major side
            effects, drug interactions and monitoring. This tool does not take
            the place of a pharmacology course or textbook rather it will
            provide positive engagement to help solidify and retain drug facts
            that you will need know as you safely administer and or prescribe
            medications. The author welcomes questions and comments on the
            application and can be reached at: Lpalma@health.fau.edu
          </h5>
          <br></br>
          <div
            className="container about-page"
            style={{ background: "lightyellow" }}
          ></div>
          <div className="text-zone" style={{ top: "150%" }}>
            <h1 style={{ fontSize: "70px" }}>
              <AnimatedLetters
                letterClass={letterClass}
                strArray={["D", "E", "V", "E", "L", "O", "P", "E", "R", "S"]}
                idx={25}
              />
            </h1>
            <div class="imggroup d-flex btn-group">
              <span>
                <img
                  class="im"
                  src={require("../Justin.png")}
                  style={{ width: "10rem", height: "10rem" }}
                  alt=" "
                />
                <h5> Justin Sison</h5>
                <h5>Computer Science</h5>
                <br></br>
              </span>
              <span>
                <img
                  class="im"
                  src={require("../Faith.jpg")}
                  style={{ width: "10rem", height: "10rem" }}
                  alt=" "
                />{" "}
                <h5>Faith Scott</h5>
                <h5>Computer Science</h5>
              </span>
              <br></br>
              <span>
                <img
                  class="im"
                  src={require("../Serwin.jpg")}
                  style={{ width: "10rem", height: "10rem" }}
                  alt=" "
                />
                <h5> Serwin Kastaneer</h5>
                <h5>Computer Science</h5>
                <br></br>
              </span>
              <span>
                <img
                  class="im"
                  src={require("../Johnny.jpg")}
                  style={{ width: "10rem", height: "10rem" }}
                  alt=" "
                />{" "}
                <h5> Johnny Figueroa </h5>
                <h5>Computer Science</h5>
                <br></br>
              </span>
              <span>
                <img
                  class="im"
                  src={require("../Tyler.jpg")}
                  style={{ width: "10rem", height: "10rem" }}
                  alt=" "
                />
                <h5> Tyler Alber </h5>
                <h5>Computer Science</h5>
                <br></br>
                <br></br>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About
