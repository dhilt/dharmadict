import React, {Component} from 'react'
import {connect} from 'react-redux'

import {doSearchRequestAsync} from '../actions'

class Term extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let term = this.props.data.term
    console.log(term)
    return (
      <div>
        <div className="term-header">
          <div className="wylie">{term.wylie}</div>
          {
            term.sanskrit_rus ? (
              <div className="sanskrit">Санскрит: {term.sanskrit_rus}</div>
            ) : ( null )
          }
        </div>
      </div>
    )
  }
}

Term.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func
}

function select (state) {
  return {
    data: state.selected
  }
}

export default connect(select)(Term)
