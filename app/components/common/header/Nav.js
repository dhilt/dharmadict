import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {openLoginModal, closeLoginModal, changeLoginString, changePasswordString, doLoginAsync} from '../../../actions/auth'
import {doLogout} from '../../../actions/auth'

import LoadingButton from '../LoadingButton'
import Login from './Login'
import Logout from './Logout'

class Nav extends Component {

  constructor (props) {
    super(props)
    this.doLogout = this.doLogout.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.doLogin = this.doLogin.bind(this)
    this.onLoginChange = this.onLoginChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
  }

  render () {
    let userInfo = !this.props.data.userInfo.pending ? this.props.data.userInfo.data : {}
    let navButtons = this.props.data.loggedIn ? (
      <div>
        <Link to={'/user?name=' + userInfo.login}>{userInfo.name}</Link>
        <Logout doLogout={this.doLogout} />
        {userInfo.role === 'admin' ? <Link to={`/newTerm`}>New term</Link> : null}
      </div>
    ) : (
      <div>
        {this.props.data.userInfo.pending ?
          <LoadingButton className='btn--nav' />
          :
          <Login
            data={this.props.data}
            openModal={this.openModal}
            closeModal={this.closeModal}
            doLogin={this.doLogin}
            onLoginChange={this.onLoginChange}
            onPasswordChange={this.onPasswordChange}
          />
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

  doLogout () {
    this.props.dispatch(doLogout())
  }

  openModal (event) {
    this.props.dispatch(openLoginModal())
  }

  closeModal () {
    this.props.dispatch(closeLoginModal())
  }

  onLoginChange (value) {
    this.props.dispatch(changeLoginString(value))
  }

  onPasswordChange (value) {
    this.props.dispatch(changePasswordString(value))
  }

  doLogin (event) {
    this.props.dispatch(doLoginAsync())
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
