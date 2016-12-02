import React, {Component} from 'react'
import {connect} from 'react-redux'

import TermList from './TermList'
import Term from '../Term'

class SearchResults extends Component {
  render () {
    let searchState = this.props.data
    return (
    <div className="row search-results-row"> {
        searchState.started && searchState.result && !searchState.pending ? (
      <div>
        <div className="col-md-3">
          <div className="list-group terms">
              <TermList />
          </div>
        </div>
        <div className="col-md-9">
          <div className="term">
            {
              this.props.getSelectedTerm() ? (
                <Term />
              ) : ( null )
            }
          </div>
        </div>
      </div>
        ) :
          searchState.started && !searchState.pending ?
          ( <div> nothing found </div> ) :
          ( null )
      } {
        searchState.error ? (
      <div> { searchState.error.message } </div>
        ) : ( null )
      }
    </div>
    )
  }
}

function select (state) {
  return {
    data: state.searchState,
    getSelectedTerm: () => state.selected.term
  }
}

SearchResults.propTypes = {
  data: React.PropTypes.object
}

export default connect(select)(SearchResults)
