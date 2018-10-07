import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import lang from '../../helpers/lang'
import {changeUserLanguage} from '../../actions/common'
import {
  changePasswordString,
  changeLoginString,
  closeLoginModal,
  openLoginModal,
  doLoginAsync,
  doLogout
} from '../../actions/auth'

import Languages from './header/Languages'
import AuthLinks from './header/AuthLinks'

class Header extends Component {

  constructor (props) {
    super(props)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onLoginChange = this.onLoginChange.bind(this)
    this.doChangeLang = this.doChangeLang.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
    this.doLogout = this.doLogout.bind(this)
    this.doLogin = this.doLogin.bind(this)
  }

  render () {
    const {authData} = this.props
    const {languages, userLanguage} = this.props.common
    return (
      <div data-test-id="Header" className="nav">
        <div className="nav__wrapper">
          <div className="nav__wrapper-left">
            <div>
              <Link to={'/'}>
                <FormattedMessage id="Header.home_link" />
              </Link>
              <Link to={'/pages/about'}>
                <FormattedMessage id="Header.about_project" />
              </Link>
              <Link to={'/pages/translators'}>
                <FormattedMessage id="Header.translators" />
              </Link>
            </div>
            <div>
              <Link to={'/pages/translation_features'}>
                <FormattedMessage id="Header.translation_features" />
              </Link>
              <Link to={'/pages/parallel_texts'}>
                <FormattedMessage id="Header.parallel_texts" />
              </Link>
              <Link to={'/pages/history'}>
                <FormattedMessage id="Header.history" />
              </Link>
            </div>
          </div>
          <AuthLinks
            data={authData}
            onPasswordChange={this.onPasswordChange}
            onLoginChange={this.onLoginChange}
            closeModal={this.closeModal}
            openModal={this.openModal}
            doLogout={this.doLogout}
            doLogin={this.doLogin}
          />
          <Languages
            data-test-id="Header.Languages"
            doChangeLang={this.doChangeLang}
            current={userLanguage}
            languages={languages}
          />
        </div>
      </div>
    )
  }

  doLogout () {
    this.props.dispatch(doLogout())
  }

  openModal () {
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

  doLogin () {
    this.props.dispatch(doLoginAsync())
  }

  doChangeLang (langId) {
    if(this.props.common.userLanguage === lang.get(langId)) {
      return;
    }
    this.props.dispatch(changeUserLanguage(langId))
  }
}

Header.propTypes = {
  dispatch: PropTypes.func
}

function select (state) {
  return {
    authData: state.auth,
    common: state.common
  }
}

export default connect(select)(Header)
