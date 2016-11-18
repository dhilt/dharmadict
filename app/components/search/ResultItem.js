import React, {Component} from 'react'
import {connect} from 'react-redux'

class ResultItem extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <li> {this.props.item._source.wylie} </li>
    )
  }
}

function select (state) {
  return {
    data: state.searchState
  }
}

ResultItem.propTypes = {
  data: React.PropTypes.object,
  item: React.PropTypes.object.isRequired
}

export default connect(select)(ResultItem)
