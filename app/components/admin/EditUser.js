import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {updateAdminUserData, resetAdminUserData, changeAdminUserDataAsync, getAdminUserDataAsync} from '../../actions/admin/changeUsers'

class EditUser extends Component {

  constructor(props) {
    super(props)
    this.sendNewUserData = this.sendNewUserData.bind(this)
    this.changeUserName = this.changeUserName.bind(this)
    this.changeUserLanguage = this.changeUserLanguage.bind(this)
    this.changeUserDescription = this.changeUserDescription.bind(this)
    this.resetChanges = this.resetChanges.bind(this)
  }

  componentWillMount () {
    this.props.dispatch(getAdminUserDataAsync(this.props.params.id))
  }

  changeUserName (event) {
    this.props.dispatch(updateAdminUserData({name: event.target.value}))
  }

  changeUserLanguage (language) {
    this.props.dispatch(updateAdminUserData({language}))
  }

  changeUserDescription (event) {
    this.props.dispatch(updateAdminUserData({description: event.target.value}))
  }

  resetChanges (event) {
    event.preventDefault()
    this.props.dispatch(resetAdminUserData())
  }

  sendNewUserData (event) {
    event.preventDefault()
    this.props.dispatch(changeAdminUserDataAsync())
  }

  render () {
    const {id} = this.props.params
    const {languages} = this.props
    const {pending, error, result} = this.props.newTranslatorInfo
    const {name, language, description} = this.props.newTranslatorInfo.data
    return (
      <div>
        <form className="col-md-6">
          <h3><FormattedMessage id="EditUser.title_edit_user" values={{id}} /></h3>
          <div className="form-group">
            <label><FormattedMessage id="EditUser.name_of_translator" /></label>
            <input
              type="text"
              value={name}
              className="form-control"
              onChange={this.changeUserName}
            />
          </div>
          <div className="form-group">
            <label><FormattedMessage id="EditUser.language_of_translations" /></label>
            {languages && languages.map(lang =>
              <div className="radio" key={lang.id}>
                <label>
                  <input
                    type="radio"
                    name="lang_radio"
                    onChange={() => this.changeUserLanguage(lang.id)}
                    checked={language === lang.id}
                  />{lang.name_rus}
                </label>
              </div>
            )}
          </div>
          <div className="form-group">
            <label><FormattedMessage id="EditUser.description_of_translator" /></label>
            <textarea
              type="text"
              value={description}
              className="form-control"
              onChange={this.changeUserDescription}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={this.sendNewUserData}
            disabled={pending}
            ><FormattedMessage id="EditUser.button_save" />
          </button>
          <button
            className="btn btn-default"
            onClick={this.resetChanges}
          ><FormattedMessage id="EditUser.button_reset_changes" />
          </button>
          <Link to={`/translator/${id}`}>
            <FormattedMessage id="EditUser.button_cancel" />
          </Link>
          {error && <div className="alert alert-danger">{error.message}</div>}
        </form>
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    newTranslatorInfo: state.admin.editUser,
    languages: state.common.languages
  }
}

export default connect(select)(EditUser)
