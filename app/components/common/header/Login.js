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
    <span>
      <a href="/login" onClick={openModal}><FormattedMessage id="Login.header_button_log_in" /></a>
      <Modal
        contentLabel="Log In Dialog"
        isOpen={props.data.modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}>
        <h1><FormattedMessage id="Login.please_log_in"/></h1>
        <div className="login-modal-content">
          <form>
            <div className="form-group">
              <input
                type="text"
                name="login"
                placeholder="login"
                className="form-control"
                value={props.data.login}
                onChange={onLoginChange} />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="password"
                className="form-control"
                value={props.data.password}
                onChange={onPasswordChange} />
            </div>
            <button className={"btn btn-primary" + (props.data.pending ? " loader" : "")}
              onClick={doLogin} type="submit"
              disabled={!props.data.login || !props.data.password || props.data.pending}>
              <span className={props.data.pending ? "invisible" : ""}>
                <FormattedMessage id="Login.button_log_in" />
              </span>
            </button>
            <button className="btn btn-default"
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
