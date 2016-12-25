import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import Meanings from './edit/Meanings'

import {selectTranslation} from '../actions/edit'

class Edit extends Component {

  componentWillMount () {
    let translatorId = this.props.query.translatorId
    let termId = this.props.query.termId
    if(!translatorId || !termId) {
      this.blockMessage = 'You should select a term to edit.'
      return
    }
    this.props.dispatch(selectTranslation(translatorId, termId))
  }

  render () {
    let editState = this.props.editState
    let allOk = editState.started && !this.blockMessage && !editState.pending && !editState.error
    return (
      <div>
        <Link to='/'>
          Назад
        </Link>
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
    editState: state.edit,
    query: ownProps.location.query
  }
}

export default connect(select)(Edit)
