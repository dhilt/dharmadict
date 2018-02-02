import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import lang from '../../helpers/lang'
import {
  updateAdminUserDataAsync,
  getAdminUserDataAsync,
  changeAdminUserData,
  resetAdminUserData
} from '../../actions/admin/changeUser'

class EditUser extends Component {

  constructor(props) {
    super(props)
    this.changeUserDescription = this.changeUserDescription.bind(this)
    this.changeUserLanguage = this.changeUserLanguage.bind(this)
    this.sendNewUserData = this.sendNewUserData.bind(this)
    this.changeUserName = this.changeUserName.bind(this)
    this.resetChanges = this.resetChanges.bind(this)
  }

  componentWillMount () {
    this.props.dispatch(getAdminUserDataAsync(this.props.params.id))
  }

  changeUserName (event) {
    this.props.dispatch(changeAdminUserData({name: event.target.value}))
  }

  changeUserLanguage (language) {
    this.props.dispatch(changeAdminUserData({language}))
  }

  changeUserDescription (event) {
    this.props.dispatch(changeAdminUserData({description: event.target.value}))
  }

  resetChanges (event) {
    event.preventDefault()
    this.props.dispatch(resetAdminUserData())
  }

  sendNewUserData (event) {
    event.preventDefault()
    this.props.dispatch(updateAdminUserDataAsync())
  }

  render () {
    const {id} = this.props.params
    const {languages, userLanguage} = this.props.common
    const {sourcePending, pending} = this.props.editUser
    const {name, language, description} = this.props.editUser.data
    return !sourcePending ? (
      <div data-test-id="EditUser">
        <form className="col-md-6">
          <h3 data-test-id="heading">
            <FormattedMessage id="EditUser.title_edit_user" values={{id}} />
          </h3>
          <div className="form-group">
            <label data-test-id="label-name">
              <FormattedMessage id="EditUser.name_of_translator" />
            </label>
            <input data-test-id="input-name"
              onChange={this.changeUserName}
              className="form-control"
              value={name}
              type="text"
            />
          </div>
          <div className="form-group">
            <label data-test-id="label-lang">
              <FormattedMessage id="EditUser.language_of_translations" />
            </label>
            {languages && languages.map((langItem, langIndex) =>
              <div data-test-id="radio-lang" className="radio" key={langIndex}>
                <label>
                  <input data-test-id="input-lang"
                    onChange={() => this.changeUserLanguage(langItem.id)}
                    checked={language === langItem.id}
                    name="lang_radio"
                    type="radio"
                  />{langItem['name_' + lang.get(userLanguage)]}
                </label>
              </div>
            )}
          </div>
          <div data-test-id="form-desc" className="form-group">
            <label data-test-id="label-desc">
              <FormattedMessage id="EditUser.description_of_translator" />
              <span className="label-help">
                <FormattedMessage id="EditUser.description_of_translator_help" />
              </span>
            </label>
            <input data-test-id="textarea-desc"
              onChange={this.changeUserDescription}
              className="form-control"
              value={description}
              type="text"
            />
          </div>
          <div className="form-group">
            <button data-test-id="button-save"
              onClick={this.sendNewUserData}
              className="btn btn-primary"
              disabled={pending}>
              <FormattedMessage id="Common.save" />
            </button>
            <button data-test-id="button-reset"
              className="btn btn-default"
              onClick={this.resetChanges}>
              <FormattedMessage id="Common.reset" />
            </button>
            <Link data-test-id="button-cancel" to={`/translator/${id}`}>
              <FormattedMessage id="Common.cancel" />
            </Link>
          </div>
          <div className="form-group">
            <Link data-test-id="link-password" to={`/translator/${id}/edit/password`}>
              <FormattedMessage id="EditUser.link_reset_password" />
            </Link>
          </div>
        </form>
      </div>
    ) : (null)
  }
}

function select (state, ownProps) {
  return {
    editUser: state.admin.editUser,
    common: state.common
  }
}

export default connect(select)(EditUser)
