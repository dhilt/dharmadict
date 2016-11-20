import React, {Component} from 'react'
import {connect} from 'react-redux'

import ResultItem from './ResultItem'

class ResultList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (this.props.data.result || this.props.data.pending) ? (
      this.props.data.pending ? (
        <div> pending... </div>
      ) : (
        this.props.data.result.length > 0 ? (
          <ul> {
              this.props.data.result.map((item, i) => {
                return <ResultItem key={i} item={item} />
              })
            }
          </ul>
        ) : (
          <div> nothing found </div>
        )
      )
    ) : (
      this.props.data.error ? (
        <div> { this.props.data.error.message } </div>
      ) : (
        null
      )
    )
  }
}

function select (state) {
  return {
    data: state.searchState
  }
}

ResultList.propTypes = {
  data: React.PropTypes.object
}

export default connect(select)(ResultList)
