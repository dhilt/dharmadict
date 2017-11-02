import React from 'react'
import PropTypes from 'prop-types'

function ErrorMessage (props) {
  return (
    <div data-test-id="ErrorMessage" className='form__error-wrapper js-form__err-animation'>
      <p data-test-id="ErrorMessage.text" className='form__error'>
        {props.error}
      </p>
    </div>
  )
}

ErrorMessage.propTypes = {
  error: PropTypes.string
}

export default ErrorMessage
