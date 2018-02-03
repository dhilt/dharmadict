import React from 'react'
import Modal from 'react-modal'
import {FormattedMessage} from 'react-intl'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

const Login = props => {

  return (
    <span data-test-id="Login">
      <a data-test-id="Login.link_open_modal" href="/login" onClick={openModal}>
        <FormattedMessage id="Login.header_button_log_in" />
      </a>
      <Modal data-test-id="Login.modal"
        isOpen={props.data.modalIsOpen}
        contentLabel="Log In Dialog"
        onRequestClose={closeModal}
        style={customStyles}>
        <h1><FormattedMessage id="Login.please_log_in"/></h1>
        <div className="login-modal-content">
          <form>
            <div className="form-group">
              <input data-test-id="Login.input-login"
                value={props.data.login}
                onChange={onLoginChange}
                className="form-control"
                placeholder="login"
                name="login"
                type="text"
              />
            </div>
            <div className="form-group">
              <input data-test-id="Login.input-password"
                value={props.data.password}
                onChange={onPasswordChange}
                className="form-control"
                placeholder="password"
                name="password"
                type="password"
              />
            </div>
            <button data-test-id="Login.button_do_login"
              disabled={!props.data.login || !props.data.password || props.data.pending}
              className={"btn btn-primary" + (props.data.pending ? " loader" : "")}
              onClick={doLogin} type="submit">
              <span data-test-id="Login.button_do_login_text"
                className={props.data.pending ? "invisible" : ""}>
                <FormattedMessage id="Login.button_log_in" />
              </span>
            </button>
            <button data-test-id="Login.button_cancel"
              className="btn btn-default"
              onClick={closeModal}>
              <FormattedMessage id="Common.cancel" />
            </button>
          </form>
        </div>
      </Modal>
    </span>
  )

  function openModal (event) {
    event.preventDefault()
    props.openModal()
  }

  function closeModal () {
    props.closeModal()
  }

  function onLoginChange (event) {
    props.onLoginChange(event.target.value)
  }

  function onPasswordChange (event) {
    props.onPasswordChange(event.target.value)
  }

  function doLogin (event) {
    event.preventDefault()
    props.doLogin()
  }
}

export default Login
