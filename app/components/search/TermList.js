import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {selectTerm} from '../../actions/search'

class TermList extends Component {
  constructor(props) {
    super(props)
    this._selectTerm = this._selectTerm.bind(this)
  }

  render() {
    const {termList} = this.props
    return (
      <div data-test-id="TermList">
      {
        termList && termList.map((item, i) =>
          <div data-test-id={item.wylie}
            className={'list-group-item' + (this.props.isTermSelected(item) ? ' selected' : '') }
            onClick={()=>this._selectTerm(item)}
            key={i}
          >{item.wylie}
          </div>
        )
      }
      </div>
    )
  }

  _selectTerm(term) {
    if (this.props.isTermSelected(term)) {
      return
    }
    this.props.dispatch(selectTerm(term))
  }
}

function select(state) {
  return {
    termList: state.search.result,
    isTermSelected: (term) =>
      state.selected.term && state.selected.term.wylie === term.wylie
  }
}

TermList.propTypes = {
  data: PropTypes.object
}

export default connect(select)(TermList)
