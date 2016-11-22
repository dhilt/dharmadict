import React, {Component} from 'react'
import {connect} from 'react-redux'
import Modal from 'react-modal'

import {openLoginModal, closeLoginModal, changeLoginString, changePasswordString, doLoginAsync} from '../../actions'

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

class LoginModal extends Component {
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
      <div>
        <div>
          <button onClick={this.openModal}>LOGIN</button>
        </div>
        <Modal
          isOpen={this.props.data.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}>
          <h1>Please Log In</h1>
          <div className="login-modal-content">
            <div>
              <input type="text" name="login" placeholder="login"
                value={this.props.data.login}
                onChange={this.onLoginChange} />
            </div>
            <div>
              <input type="password" name="password" placeholder="password"
                value={this.props.data.password}
                onChange={this.onPasswordChange} />
            </div>
          </div>
          <button onClick={this.doLogin} disabled={!this.props.data.login || !this.props.data.password}>Log in!</button>
          <button onClick={this.closeModal}>Cancel</button>
        </Modal>
      </div>
    )
  }

  openModal () {
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
    this.props.dispatch(doLoginAsync(this.props.data.login, this.props.data.password))
  }
}

LoginModal.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func
}

function select (state) {
  return {
    data: state.auth
  }
}

export default connect(select)(LoginModal)
