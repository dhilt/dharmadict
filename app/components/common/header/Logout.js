import React from 'react'

const Logout = props => {

  return (
    <span>
      <a href='/logout' onClick={_doLogout}>{'Logout'}</a>
    </span>
  )

  function _doLogout (event) {
    event.preventDefault()
    props.doLogout()
  }
}

export default Logout
