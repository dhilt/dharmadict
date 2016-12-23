import React, {Component} from 'react'
import {connect} from 'react-redux'

import {doLogout} from '../../actions/auth'

class Logout extends Component {
  constructor (props) {
    super(props)
    this._doLogout = this._doLogout.bind(this)
  }

  render () {
    return (
      <span>
        <a href="/logout" onClick={this._doLogout}>Logout</a>
      </span>
    )
  }

  _doLogout (event) {
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
