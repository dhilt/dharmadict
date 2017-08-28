import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import LoadingButton from './LoadingButton'
import Login from './Login'
import Logout from './Logout'

class Nav extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let userInfo = !this.props.data.userInfo.pending ? this.props.data.userInfo.data : {}
    let navButtons = this.props.data.loggedIn ? (
      <div>
        {userInfo.name}
        <Logout />
        {userInfo.role === 'admin' ? <Link to={`/newTerm`}>New term</Link> : null}
      </div>
    ) : (
      <div>
        {this.props.data.userInfo.pending ?
          <LoadingButton className='btn--nav' /> : <Login />
        }
      </div>
    )

    return (
      <div className='nav'>
        <div className='nav__wrapper'>
          <span className='nav__logo-wrapper'></span>
          {navButtons}
        </div>
      </div>
    )
  }
}

Nav.propTypes = {
  dispatch: PropTypes.func
}

function select (state) {
  return {
    data: state.auth
  }
}

export default connect(select)(Nav)
