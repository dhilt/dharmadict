import React, {Component} from 'react'
import {connect} from 'react-redux'

import {doSearchRequestAsync} from '../actions'

class Term extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
        {this.props.data.term.wylie}!
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
