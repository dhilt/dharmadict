import React, {Component} from 'react'
import {connect} from 'react-redux'

class Test extends Component {
  render () {
    return (
        <div>
          Test test test
        </div>
    )
  }
}

function select (state) {
  return {
    data: state
  }
}

export default connect(select)(Test)
