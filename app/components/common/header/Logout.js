import React from 'react'
import {FormattedMessage} from 'react-intl'

const Logout = props => {

  return (
    <span data-test-id="Logout">
      <a data-test-id="Logout.button_logout" href='/logout' onClick={doLogout}>
        <FormattedMessage id="Logout.button_logout" />
      </a>
    </span>
  )

  function doLogout (event) {
    event.preventDefault()
    props.doLogout()
  }
}

export default Logout
