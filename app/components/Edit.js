import React, {Component} from 'react'
import {connect} from 'react-redux'

import {requestTermAsync} from '../actions'

class Edit extends Component {
  constructor (props) {
    super(props)
    let translatorId = this.props.query.translatorId
    let wylie = this.props.query.wylie

    if(!translatorId || !wylie) {
      this.blockMessage = 'You should select a term to edit.'
      return
    }

    if(!this.props.term) {
      this.props.dispatch(requestTermAsync(translatorId, wylie))
    }
    console.log(translatorId)
    console.log(wylie)
  }

  render () {
    if(this.blockMessage) {
      return (
        <div className="blocker">
          {this.blockMessage}
        </div>
      )
    }
    return (
      <div>
        Edit a term
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    term: state.selected.term,
    query: ownProps.location.query
  }
}

export default connect(select)(Edit)
