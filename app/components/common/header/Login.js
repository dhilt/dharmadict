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
      <a data-test-id="Login.header_button_log_in" href="/login" onClick={openModal}>
        <FormattedMessage id="Login.header_button_log_in" />
      </a>
      <Modal data-test-id="Login.modal"
        contentLabel="Log In Dialog"
        isOpen={props.data.modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}>
        <h1 data-test-id="Login.title_log_in">
          <FormattedMessage id="Login.please_log_in"/>
        </h1>
        <div data-test-id="Login.modal-content" className="login-modal-content">
          <form data-test-id="Login.form">
            <div data-test-id="Login.form-login" className="form-group">
              <input data-test-id="Login.input-login"
                type="text"
                name="login"
                placeholder="login"
                className="form-control"
                value={props.data.login}
                onChange={onLoginChange} />
            </div>
            <div data-test-id="Login.form-password" className="form-group">
              <input data-test-id="Login.input-password"
                type="password"
                name="password"
                placeholder="password"
                className="form-control"
                value={props.data.password}
                onChange={onPasswordChange} />
            </div>
            <button data-test-id="Login.button_do_login"
              className={"btn btn-primary" + (props.data.pending ? " loader" : "")}
              onClick={doLogin} type="submit"
              disabled={!props.data.login || !props.data.password || props.data.pending}>
              <span data-test-id="Login.button_do_login_text"
                className={props.data.pending ? "invisible" : ""}
              ><FormattedMessage id="Login.button_log_in" />
              </span>
            </button>
            <button data-test-id="Login.button_cancel" className="btn btn-default"
              onClick={closeModal}
            ><FormattedMessage id="Common.cancel" />
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
