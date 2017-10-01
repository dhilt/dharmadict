import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {openLoginModal, closeLoginModal, changeLoginString, changePasswordString, doLoginAsync, doLogout} from '../../actions/auth'
import {changeUserLanguage} from '../../actions/common'

import LoadingButton from './LoadingButton'
import Login from './header/Login'
import Logout from './header/Logout'

class Header extends Component {

  constructor (props) {
    super(props)
    this.doLogout = this.doLogout.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.doLogin = this.doLogin.bind(this)
    this.onLoginChange = this.onLoginChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.showLanguageMenu = this.showLanguageMenu.bind(this)
    this._changeUserLanguage = this._changeUserLanguage.bind(this)
    this.state = {languagesMenuIsShowed: false}
  }

  render () {
    let userInfo = !this.props.data.userInfo.pending ? this.props.data.userInfo.data : {}
    let languageBar =
      <span className="dropdown" style={{cursor: 'pointer'}} onClick={this.showLanguageMenu}>{'  Change language'}
        <ul className="dropdown-menu" style={{display: this.state.languagesMenuIsShowed ? 'block' : 'none'}}>
        {
          this.props.languages && this.props.languages.length && this.props.languages.map(lang =>
            <li key={lang.id} onClick={() => this._changeUserLanguage(lang.id)}>{lang.name}</li>
          )
        }
        </ul>
      </span>
    let navButtons = this.props.data.loggedIn ? (
      <div>
        <Link to={`/translator/${userInfo.id}`}>{userInfo.name}</Link>
        <Logout doLogout={this.doLogout} />
        {userInfo.role === 'admin' ? <Link to={`/newTerm`}><FormattedMessage id="Header.create_new_term" /></Link> : null}
        {languageBar}
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
        {languageBar}
      </div>
    )

    return (
      <div className='nav'>
        <div className='nav__wrapper'>
          <Link to={'/about'}><FormattedMessage id="Header.about_project" /></Link>
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

  showLanguageMenu () {
    this.setState({languagesMenuIsShowed: !this.state.languagesMenuIsShowed})
  }

  _changeUserLanguage (langId) {
    this.props.dispatch(changeUserLanguage(langId))
  }
}

Header.propTypes = {
  dispatch: PropTypes.func
}

function select (state) {
  return {
    data: state.auth,
    languages: state.common.languages
  }
}

export default connect(select)(Header)
