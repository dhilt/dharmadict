import React, {Component} from 'react'
import {connect} from 'react-redux'

import {selectTerm} from '../../actions'

import ResultItem from './ResultItem'

class ResultList extends Component {
  constructor(props) {
    super(props)
    this.selectTerm = this.selectTerm.bind(this)
  }

  render() {
    return (this.props.data.result || this.props.data.pending) ? (
      this.props.data.pending ? (
        <div> pending... </div>
      ) : (
        this.props.data.result.length > 0 ? (
          <div className="row search-results-row">
    				<div className="col-md-3">
    					<div className="list-group terms">
          {
            this.props.data.result.map((item, i) =>
                <div
                  className={'list-group-item' + (this.props.isTermSelected(item) ? ' selected' : '') }
                  key={i} onClick={()=>this.selectTerm(item)}>
                  {item.wylie}
                </div>
            )
          }
              </div>
            </div>
          </div>
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

  selectTerm(term) {
    if (this.props.isTermSelected(term)) {
      return
    }
    this.props.dispatch(selectTerm(term))
  }
}

function select(state) {
  return {
    data: state.searchState,
    isTermSelected: (term) =>
      state.selected.term && state.selected.term.wylie === term.wylie
  }
}

ResultList.propTypes = {
  data: React.PropTypes.object
}

export default connect(select)(ResultList)
