import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {setUserId, changeAdminUserPassword, resetAdminUserPassword, updateAdminUserPasswordAsync} from '../../actions/admin/changeUserPassword'

class EditUserPassword extends Component {

  constructor(props) {
    super(props)
    this.sendNewUserData = this.sendNewUserData.bind(this)
    this.resetChanges = this.resetChanges.bind(this)
    this.changeUserPassword = this.changeUserPassword.bind(this)
    this.changeUserConfirmPassword = this.changeUserConfirmPassword.bind(this)
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
    const {result, error, password, confirmPassword} = this.props.stateData
    return (
      <div>
        <form className="col-md-6">
          <h3><FormattedMessage id="EditUserPassword.title" values={{id}} /></h3>
          <div className="form-group">
            <label>
              <FormattedMessage id="EditUserPassword.new_password" />
              <span className="hint">
                <FormattedMessage id="EditUserPassword.new_password_hint" />
              </span>
            </label>
            <input
              type="password"
              value={password}
              className="form-control"
              onChange={this.changeUserPassword}
            />
          </div>
          <div className="form-group">
            <label><FormattedMessage id="EditUserPassword.new_password_confirm" /></label>
            <input
              type="password"
              value={confirmPassword}
              className="form-control"
              onChange={this.changeUserConfirmPassword}
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary"
              onClick={this.sendNewUserData}
              disabled={this.disabled()}
              ><FormattedMessage id="EditUser.button_save" />
            </button>
            <button
              className="btn btn-default"
              onClick={this.resetChanges}
            ><FormattedMessage id="EditUser.button_reset_changes" />
            </button>
            <Link to={`/translator/${id}/edit`}>
              <FormattedMessage id="EditUser.button_cancel" />
            </Link>
          </div>
          <div className="form-group">
            {error && <div className="alert alert-danger">{error.message}</div>}
            {result &&
              <div className="alert alert-success">
                <FormattedMessage id="EditUserPassword.new_password_success" />
              </div>
            }
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
