import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Modal from 'react-modal'

import {openLoginModal, closeLoginModal, changeLoginString, changePasswordString, doLoginAsync} from '../../actions/auth'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Login extends Component {
  constructor (props) {
    super(props)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.doLogin = this.doLogin.bind(this)
    this.onLoginChange = this.onLoginChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
  }

  render () {
    return (
      <span>
        <a href="/login" onClick={this.openModal}>Login</a>
        <Modal
          contentLabel='Log In Dialog'
          isOpen={this.props.data.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}>
          <h1>Please Log In</h1>
          <div className="login-modal-content">
            <form>
              <div className="form-group">
                <input type="text" name="login" placeholder="login"
                  className="form-control"
                  value={this.props.data.login}
                  onChange={this.onLoginChange} />
              </div>
              <div className="form-group">
                <input type="password" name="password" placeholder="password"
                  className="form-control"
                  value={this.props.data.password}
                  onChange={this.onPasswordChange} />
              </div>
              <button className={"btn btn-primary" + (this.props.data.pending ? " loader" : "")}
                onClick={this.doLogin} type="submit"
                disabled={!this.props.data.login || !this.props.data.password || this.props.data.pending}>
                <span className={this.props.data.pending ? "invisible" : ""}>
                  Log in!
                </span>
              </button>
              <button className="btn btn-default"
                onClick={this.closeModal}>
                  Cancel
              </button>
            </form>
          </div>
        </Modal>
      </span>
    )
  }

  openModal (event) {
    event.preventDefault()
    this.props.dispatch(openLoginModal())
  }

  closeModal () {
    this.props.dispatch(closeLoginModal())
  }

  onLoginChange (event) {
    this.props.dispatch(changeLoginString(event.target.value))
  }

  onPasswordChange (event) {
    this.props.dispatch(changePasswordString(event.target.value))
  }

  doLogin (event) {
    event.preventDefault()
    this.props.dispatch(doLoginAsync())
  }
}

Login.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func
}

function select (state) {
  return {
    data: state.auth
  }
}

export default connect(select)(Login)
