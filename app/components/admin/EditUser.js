import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {changeUserDataAsync, writeUserName, writeUserLanguage, writeUserDescription, getTranslatorInfoAsync} from '../../actions/admin/changeUsers'

class EditUser extends Component {

  constructor(props) {
    super(props)
    this.sendNewUserData = this.sendNewUserData.bind(this)
    this.changeUserName = this.changeUserName.bind(this)
    this.changeUserLanguage = this.changeUserLanguage.bind(this)
    this.changeUserDescription = this.changeUserDescription.bind(this)
  }

  componentWillMount () {
    const {name} = this.props.initTranslatorInfo
    if (name === '') {
      this.props.dispatch(getTranslatorInfoAsync(this.props.params.login))
    }
  }

  changeUserName (event) {
    this.props.dispatch(writeUserName(event.target.value))
  }

  changeUserLanguage (language) {
    this.props.dispatch(writeUserLanguage(language))
  }

  changeUserDescription (event) {
    this.props.dispatch(writeUserDescription(event.target.value))
  }

  sendNewUserData (event) {
    event.preventDefault()
    const userId = this.props.params.login.toUpperCase();
    this.props.dispatch(changeUserDataAsync(userId))
  }

  render () {
    const { pending, error, result, name, language, description } = this.props.newTranslatorInfo
    return (
      <div className="wrapper">
        <h3>{'Admin page'}</h3>
        <div className='container'>
          <form className="thumbnail col-md-6">
            <h3>{'Change user information'}</h3>
            <div className="form-group">
              <label>{'Enter name'}</label>
              <input
                type="text"
                value={name}
                className="form-control"
                placeholder="User name"
                onChange={this.changeUserName}
              />
            </div>
            <div className="form-group">
              <label>{'Pick language'}</label>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    name="optradio"
                    onClick={() => this.changeUserLanguage('rus')}
                    checked={language === 'rus'}
                  />{'Russian'}
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                    type="radio"
                    name="optradio"
                    onClick={() => this.changeUserLanguage('eng')}
                    checked={language === 'eng'}
                  />{'English'}
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>{'Enter description'}</label>
              <textarea
                type="text"
                value={description}
                className="form-control"
                placeholder="User description"
                onChange={this.changeUserDescription}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={this.sendNewUserData}
              disabled={pending}
              >{'Change'}
            </button>
            <Link to={`/translator/${this.props.params.login}`}>
              <button className="btn">{'Вернуться на страницу переводчика'}</button>
            </Link>
            {error && <div className="alert alert-danger">{error.message}</div>}
            {!error && result && <div className="alert alert-success">{'success'}</div>}
          </form>
        </div>
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    newTranslatorInfo: state.admin.changeUserData,
    initTranslatorInfo: state.translatorInfo.data
  }
}

export default connect(select)(EditUser)
