import React from 'react'
import './Wrapper.scss'
import '../../App.scss'

function Wrapper(props) {
  return (
    <div className='App' style={{ background: 'lightyellow' }}>
      <div className='page' style={{ background: 'lightyellow' }}>
        {props.props.children}
      </div>
    </div>
  )
}

export default Wrapper
