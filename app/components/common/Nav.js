import React, {Component} from 'react'
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
            <Link to='/edit'>Edit</Link>
            <Logout dispatch={this.props.dispatch}/>
          </span>
        ) : (
          <Login dispatch={this.props.dispatch}/>
        )}
      </div>
    )

    return (
      <div className='nav'>
        <div className='nav__wrapper'>
          <Link to='/' className='nav__logo-wrapper' onClick={this._clearError}>
            <h1 className='nav__logo'>Dharma Dictionary</h1>
          </Link>
          {navButtons}
        </div>
      </div>
    )
  }
}

Nav.propTypes = {
  dispatch: React.PropTypes.func
}

function select (state) {
  return {
    data: state.auth
  }
}

export default connect(select)(Nav)
