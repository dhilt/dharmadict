import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import TermList from './TermList'
import Term from './Term'

class SearchResults extends Component {
  render () {
    let search = this.props.data
    return (
    <div data-test-id="SearchResults" className="row search-results-row"> {
        search.started && search.result && !search.pending ? (
      <div>
        <div className="col-md-3">
          <div className="list-group terms">
            <TermList />
          </div>
        </div>
        <div className="col-md-9">
          {
            this.props.getSelectedTerm() ? (
              <Term />
            ) : ( null )
          }
        </div>
      </div>
        ) :
          search.started && !search.pending ?
            ( <div> nothing found </div> ) :
            ( null )
      } {
        search.error ? (
      <div> { search.error.message } </div>
        ) : ( null )
      }
    </div>
    )
  }
}

function select (state) {
  return {
    data: state.search,
    getSelectedTerm: () => state.selected.term
  }
}

SearchResults.propTypes = {
  data: PropTypes.object
}

export default connect(select)(SearchResults)
