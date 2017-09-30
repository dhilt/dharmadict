import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import Meanings from './edit/Meanings'

import {selectTranslation} from '../actions/edit'
import {goBack} from '../actions/route'

class Edit extends Component {

  constructor(props) {
    super(props)
    this._goBack = this._goBack.bind(this)
  }

  componentWillMount() {
    const {translatorId, termId} = this.props.query
    if (!translatorId || !termId) {
      this.blockMessage = <h1><FormattedMessage id="Edit.should_select_term" /></h1>
      return
    }
    this.props.dispatch(selectTranslation(translatorId, termId))
  }

  _goBack() {
    this.props.dispatch(goBack(true))
  }

  render () {
    let editState = this.props.editState
    let allOk = editState.started && !this.blockMessage && !editState.pending && !editState.error
    return (
      <div>
        <a className="back-link" onClick={() => this._goBack()}>
          <FormattedMessage id="Edit.go_back" />
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
              <FormattedMessage id="Edit.query_is_performed" />
            </div>
          ) : ( null )
        }
        {
          editState.error ? (
            <div>
              <FormattedMessage id="Edit.request_error" />
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
