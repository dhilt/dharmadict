import React from 'react'
import PropTypes from 'prop-types'
import LoadingIndicator from './LoadingIndicator'

function LoadingButton (props) {
  return (
    <a data-test-id="LoadingButton"
      href='#'
      className={props.className + ' btn btn--loading'}
      disabled='true'
      ><LoadingIndicator data-test-id="LoadingButton.LoadingIndicator" />
    </a>
  )
}

LoadingButton.propTypes = {
  className: PropTypes.string
}

export default LoadingButton
