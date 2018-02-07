import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {
  updateAdminUserPasswordAsync,
  changeAdminUserPassword,
  resetAdminUserPassword,
  setUserId
} from '../../actions/admin/changeUserPassword'

class EditUserPassword extends Component {

  constructor(props) {
    super(props)
    this.changeUserConfirmPassword = this.changeUserConfirmPassword.bind(this)
    this.changeUserPassword = this.changeUserPassword.bind(this)
    this.sendNewUserData = this.sendNewUserData.bind(this)
    this.resetChanges = this.resetChanges.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(setUserId(this.props.params.id))
  }

  changeUserPassword (event) {
    this.props.dispatch(changeAdminUserPassword({password: event.target.value}))
  }

  changeUserConfirmPassword (event) {
    this.props.dispatch(changeAdminUserPassword({confirmPassword: event.target.value}))
  }

  resetChanges (event) {
    event.preventDefault()
    this.props.dispatch(resetAdminUserPassword())
  }

  sendNewUserData (event) {
    event.preventDefault()
    this.props.dispatch(updateAdminUserPasswordAsync())
  }

  disabled () {
    const {pending, password, confirmPassword} = this.props.stateData
    if (pending) {
      return true;
    }
    if(!password || !confirmPassword || password !== confirmPassword) {
      return true;
    }
    if(password.length < 6) {
      return true;
    }
  }

  render () {
    const {id} = this.props.params
    const {password, confirmPassword} = this.props.stateData
    return (
      <div data-test-id="EditUserPassword">
        <form className="col-md-6">
          <h3><FormattedMessage id="EditUserPassword.title" values={{id}} /></h3>
          <div className="form-group">
            <label>
              <FormattedMessage id="EditUserPassword.new_password" />
              <span className="hint">
                <FormattedMessage id="EditUserPassword.new_password_hint" />
              </span>
            </label>
            <input data-test-id="input-new-pass"
              onChange={this.changeUserPassword}
              className="form-control"
              value={password}
              type="password"
            />
          </div>
          <div className="form-group">
            <label>
              <FormattedMessage id="EditUserPassword.new_password_confirm" />
            </label>
            <input data-test-id="input-confirm-pass"
              onChange={this.changeUserConfirmPassword}
              value={confirmPassword}
              className="form-control"
              type="password"
            />
          </div>
          <div className="form-group">
            <button data-test-id="btn-save"
              onClick={this.sendNewUserData}
              className="btn btn-primary"
              disabled={this.disabled()}>
              <FormattedMessage id="Common.save" />
            </button>
            <button data-test-id="btn-reset"
              className="btn btn-default"
              onClick={this.resetChanges}>
              <FormattedMessage id="Common.reset" />
            </button>
            <Link data-test-id="btn-cancel" to={`/translator/${id}/edit`}>
              <FormattedMessage id="Common.cancel" />
            </Link>
          </div>
        </form>
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    stateData: state.admin.editUserPassword
  }
}

export default connect(select)(EditUserPassword)
