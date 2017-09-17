import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

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
    const {pending, error, result} = this.props.newTranslatorInfo
    const {name, language, description} = this.props.newTranslatorInfo.data
    return (
      <div>
        <form className="col-md-6">
          <h3>Редактирование пользователя {id}</h3>
          <div className="form-group">
            <label>Имя перерводчика</label>
            <input
              type="text"
              value={name}
              className="form-control"
              onChange={this.changeUserName}
            />
          </div>
          <div className="form-group">
            <label>Язык переводов</label>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  name="lang_radio"
                  onChange={() => this.changeUserLanguage('rus')}
                  checked={language === 'rus'}
                />Русский
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  name="lang_radio"
                  onChange={() => this.changeUserLanguage('eng')}
                  checked={language === 'eng'}
                />Английский
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Описание перерводчика</label>
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
            >Сохранить
          </button>
          <button
            className="btn btn-default"
            onClick={this.resetChanges}
          >Сбросить
          </button>
          <Link to={`/translator/${this.props.params.id}`}>
            Отмена
          </Link>
          {error && <div className="alert alert-danger">{error.message}</div>}
        </form>
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    newTranslatorInfo: state.admin.editUser
  }
}

export default connect(select)(EditUser)
