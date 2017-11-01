import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {
  updateTranslatorPasswordAsync,
  changeTranslatorPassword,
  resetTranslatorPasswords
} from '../../actions/translator/changePassword'

class EditPasswordByTranslator extends Component {

  constructor (props) {
    super(props)
    this.changeCurrentPassword = this.changeCurrentPassword.bind(this)
    this.changeNewPassword = this.changeNewPassword.bind(this)
    this.changeConfirmPassword = this.changeConfirmPassword.bind(this)
    this.resetChanges = this.resetChanges.bind(this)
    this.sendNewPassword = this.sendNewPassword.bind(this)
  }

  changeCurrentPassword (event) {
    this.props.dispatch(changeTranslatorPassword({currentPassword: event.target.value}))
  }

  changeNewPassword (event) {
    this.props.dispatch(changeTranslatorPassword({newPassword: event.target.value}))
  }

  changeConfirmPassword (event) {
    this.props.dispatch(changeTranslatorPassword({confirmPassword: event.target.value}))
  }

  resetChanges (event) {
    event.preventDefault()
    this.props.dispatch(resetTranslatorPasswords())
  }

  sendNewPassword (event) {
    event.preventDefault()
    this.props.dispatch(updateTranslatorPasswordAsync(this.props.params.id))
  }

  disabled () {
    const {pending, currentPassword, newPassword, confirmPassword} = this.props.stateData
    if (pending) {
      return true
    }
    if(!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return true
    }
    if(newPassword.length < 6) {
      return true
    }
  }

  render () {
    const {id} = this.props.params
    const {currentPassword, newPassword, confirmPassword} = this.props.stateData
    return (
      <div data-test-id="EditPasswordByTranslator">
        <form data-test-id="main-form" className="col-md-6">
          <h3 data-test-id="title"><FormattedMessage id="EditPasswordByTranslator.title" values={{id}} /></h3>
          <div data-test-id="group-current-pass" className="form-group">
            <label data-test-id="label-current-pass">
              <FormattedMessage id="EditPasswordByTranslator.current_password" />
            </label>
            <input data-test-id="input-current-pass"
              type="password"
              value={currentPassword}
              className="form-control"
              onChange={this.changeCurrentPassword}
            />
          </div>
          <div data-test-id="group-new-pass" className="form-group">
            <label data-test-id="label-new-pass">
              <FormattedMessage id="EditPasswordByTranslator.new_password" />
                <span data-test-id="hint-new-pass" className="hint">
                  <FormattedMessage id="EditPasswordByTranslator.new_password_hint" />
                </span>
            </label>
            <input data-test-id="input-new-pass"
              type="password"
              value={newPassword}
              className="form-control"
              onChange={this.changeNewPassword}
            />
          </div>
          <div data-test-id="group-confirm-pass" className="form-group">
            <label data-test-id="label-confirm-pass">
              <FormattedMessage id="EditPasswordByTranslator.new_password_confirm" />
            </label>
            <input data-test-id="input-confirm-pass"
              type="password"
              value={confirmPassword}
              className="form-control"
              onChange={this.changeConfirmPassword}
            />
          </div>
          <div data-test-id="group-button" className="form-group">
            <button data-test-id="btn-save"
              className="btn btn-primary"
              onClick={this.sendNewPassword}
              disabled={this.disabled()}
              ><FormattedMessage id="Common.save" />
            </button>
            <button data-test-id="btn-reset"
              className="btn btn-default"
              onClick={this.resetChanges}
            ><FormattedMessage id="Common.reset" />
            </button>
            <Link data-test-id="btn-cancel" to={`/translator/${id}`}>
              <FormattedMessage id="Common.cancel" />
            </Link>
          </div>
        </form>
      </div>
    )
  }
}

function select (state) {
  return {
    stateData: state.translator.editPassword
  }
}

export default connect(select)(EditPasswordByTranslator)
