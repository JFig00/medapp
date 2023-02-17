import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../Firebase'
// import './index.scss'
import Wrapper from './Wrapper'


function Navb(props) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!auth?.currentUser ||!auth.currentUser.emailVerified ) {
    return <Wrapper props={props} />
  }

  const logout = () => {
    signOut(auth)
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div>
      <Navbar sticky='top' className='nav-bar' variant='dark' expand='lg'>
        <Container>
          <Navbar.Brand className='logo'>
            {' '}
            <img
              src={require('../med1.png')}
              style={{ width: '2.5rem', height: '2.3rem' }}
              alt=' '
            />{' '}
            Welcome to Palmacology{' '}
          </Navbar.Brand>
          <Navbar.Toggle
            className='hamburger'
            aria-controls='responsize-navbar-nav'
          />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='navm ms-auto'>
              {/* <Nav.Link as = {Link} to = "/" >Login</Nav.Link>*/}

              <Nav.Link className='links text-light' as={Link} to='/Profile'>
                Profile
              </Nav.Link>
              <Nav.Link className='links text-light' as={Link} to='/Courses'>
                My Courses
              </Nav.Link>
              <Nav.Link className='links text-light' as={Link} to='/Content'>
                All Courses
              </Nav.Link>
              <Nav.Link
                className='links text-light'
                as={Link}
                to='/Trackprogress'
              >
                Track Progress
              </Nav.Link>
              <Nav.Link className='links text-light' as={Link} to='/Organizer'>
                Organizer
              </Nav.Link>
               <Nav.Link className='links text-light' as = {Link} to = "/Admin" >
                Admin
                </Nav.Link>
              <i className='bi bi-person-circle'></i>
              <div>
              <NavDropdown
                align='end'
                className='drop'
                variant='info'
                id='basic-nav-dropdown'
              >
                
                {/*<NavDropdown.Item className ="items" href="#action/3.1">Action</NavDropdown.Item>*/}
                <NavDropdown.Item>
                  <Nav.Link className='items' onClick={logout}>
                    Logout
                  </Nav.Link>
                </NavDropdown.Item>
              </NavDropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
        {/*<Navbar fixed='bottom'></Navbar>*/}
      </Navbar>
      {props.children}
    </div>
  )
}
export default Navb
