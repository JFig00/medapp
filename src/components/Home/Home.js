import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loaders'
import AnimatedLetters from '../../AnimatedLetters'
import LogoTitle from '../../assets/images/med1.png'
import Logo from './Logo'
import './index.scss'
import About from '../About/About'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  const nameArray = []
  const jobArray = ['P', 'A', 'L', 'M', 'A', 'C', 'O', 'L', 'O', 'G', 'Y', '.']

  useEffect(() => {
    setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 4000)
  }, [])

  return (
    
    <>
      <div className='container home-page'>
        <div className='text-zone'>
          <h1>
            <span className={letterClass}>W</span>
            <span className={letterClass}>E</span>
            <span className={letterClass}>L</span>
            <span className={letterClass}>C</span>
            <span className={letterClass}>O</span>
            <span className={letterClass}>M</span>
            <span className={letterClass}>E</span>
            <br />
            <span className={`${letterClass} _13`}>T</span>
            <span className={`${letterClass} _14`}>O</span>

            <AnimatedLetters
              letterClass={letterClass}
              strArray={nameArray}
              idx={15}
            />
            <br />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={jobArray}
              idx={22}
            />
          </h1>
          <img
              src={require('../med1.png')}
              style={{ width: '25rem', height: '25rem' }}
              alt=' '
            />
          {/* <h2>Full Stack Developer / JavaScript Expert / Entrepreneur</h2> */}
          <Link to='/Login' className='flat-button'>
            LOGIN
          </Link>
        </div>
        
      </div>
      <About />
      <Loader type='pacman' />
    </>
  )
}

export default Home
