import React from 'react'
import PropTypes from 'prop-types'
import LoadingIndicator from './LoadingIndicator'

function LoadingButton (props) {
  return (
    <a data-test-id="LoadingButton"
      className={props.className + ' btn btn--loading'}
      disabled="true"
      href="#"
    ><LoadingIndicator data-test-id="LoadingButton.LoadingIndicator" />
    </a>
  )
}

LoadingButton.propTypes = {
  className: PropTypes.string
}

export default LoadingButton
