import React, {Component} from 'react'
import {connect} from 'react-redux'

class Results extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (this.props.data.result || this.props.data.pending) ? (
      this.props.data.pending ? (
        <div>pending...</div>
      ) : (
        this.props.data.result.length > 0 ? (
          <ul>
            {
              this.props.data.result.map(function(item, i){
                return <li key={i}> {item._source.wylie} </li>
              })
            }
          </ul>
        ) : (
          <div> nothing found </div>
        )
      )
    ) : (
      null
    )
  }
}

function select (state) {
  return {
    data: state.searchState
  }
}

Results.propTypes = {
  data: React.PropTypes.object
}

export default connect(select)(Results)
