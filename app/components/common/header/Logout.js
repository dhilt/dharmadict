import React from 'react'
import {FormattedMessage} from 'react-intl'

const Logout = props => {

  return (
    <span>
      <a href='/logout' onClick={_doLogout}><FormattedMessage id="Logout.button_logout" /></a>
    </span>
  )

  function _doLogout (event) {
    event.preventDefault()
    props.doLogout()
  }
}

export default Logout
