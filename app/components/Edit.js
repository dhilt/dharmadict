import React, {Component} from 'react'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import {Link} from 'react-router'

import Meanings from './edit/Meanings'

import {selectTranslation} from '../actions/edit'

class Edit extends Component {

  constructor(props) {
    super(props)
    this._goBack = this._goBack.bind(this)
  }

  componentWillMount () {
    let translatorId = this.props.query.translatorId
    let termId = this.props.query.termId
    if(!translatorId || !termId) {
      this.blockMessage = 'You should select a term to edit.'
      return
    }
    this.props.dispatch(selectTranslation(translatorId, termId))
  }

  _goBack() {
    if(this.props.prevLocation) {
      browserHistory.push(this.props.prevLocation)
    }
    else {
      browserHistory.push('/')
    }
  }

  render () {
    let editState = this.props.editState
    let allOk = editState.started && !this.blockMessage && !editState.pending && !editState.error
    return (
      <div>
        <a className="back-link" onClick={() => this._goBack()}>
          Назад
        </a>
        {
          this.blockMessage ? (
            <div>
              {this.blockMessage}
            </div>
          ) : ( null )
        }
        {
          editState.pending ? (
            <div>
              Запрос выполняется. Пожалуйста, подождите...
            </div>
          ) : ( null )
        }
        {
          editState.error ? (
            <div>
              Ошибка запроса.
              <div className="error">{editState.error.message}</div>
            </div>
          ) : ( null )
        }
        {
          allOk ? (
            <Meanings />
          ) : ( null )
        }
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    prevLocation: state.route.prevLocation,
    editState: state.edit,
    query: ownProps.location.query
  }
}

export default connect(select)(Edit)
