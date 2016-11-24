import React, {Component} from 'react'
import {connect} from 'react-redux'

import {doLogout} from '../../actions'

class Logout extends Component {
  constructor (props) {
    super(props)
    this.doLogout = this.doLogout.bind(this)
  }

  render () {
    return (
      <span>
        <a href="/logout" onClick={this.doLogout}>Logout</a>
      </span>
    )
  }

  doLogout (event) {
    event.preventDefault()
    this.props.dispatch(doLogout())
  }
}

Logout.propTypes = {
  dispatch: React.PropTypes.func
}

function select (state) {
  return {
    data: state.auth
  }
}

export default connect(select)(Logout)
