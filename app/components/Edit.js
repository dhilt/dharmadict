import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import Meanings from './edit/Meanings'

import {selectTranslation} from '../actions'

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
    let allOk = this.props.data.started && !this.blockMessage && !this.props.data.pending && !this.props.data.error
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
          this.props.data.pending ? (
            <div>
              Запрос выполняется. Пожалуйста, подождите...
            </div>
          ) : ( null )
        }
        {
          this.props.data.error ? (
            <div>
              Ошибка запроса.
              <div className="error">{this.props.data.error.message}</div>
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
    data: state.edit,
    query: ownProps.location.query
  }
}

export default connect(select)(Edit)
