import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import LoadingButton from './LoadingButton'
import {Link} from 'react-router'
import Login from './Login'
import Logout from './Logout'

class Nav extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let userInfo = !this.props.data.userInfo.pending ? this.props.data.userInfo.data : {}
    let navButtons = this.props.loggedIn ? (
      <div>
        <Link to='/dashboard' className='btn btn--dash btn--nav'>Dashboard</Link>
        {this.props.currentlySending ? (
          <LoadingButton className='btn--nav' />
        ) : (
          <a href='#' className='btn btn--login btn--nav' onClick={this._logout}>Logout</a>
        )}
      </div>
    ) : (
      <div>
        {this.props.data.loggedIn ? (
          <span>
            {userInfo.name}
            <Logout dispatch={this.props.dispatch}/>
            {userInfo.role === 'admin' ? (<Link to={`/newTerm`}>New term</Link>) : ''}
          </span>
        ) : (
          <Login dispatch={this.props.dispatch}/>
        )}
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
