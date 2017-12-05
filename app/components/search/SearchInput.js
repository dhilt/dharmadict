import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {FormattedMessage} from 'react-intl'

import {changeSearchString, doSearchRequestAsync} from '../../actions/search'

class SearchInput extends Component {
  constructor (props) {
    super(props)
    this.onSearchStringChange = this.onSearchStringChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  render () {
    let search = this.props.data
    return (
      <div data-test-id="SearchInput" className="row">
        <form>
          <div className="form-group">
            <div className="col-md-6">
              <input data-test-id="search-string-input"
                onChange={this.onSearchStringChange}
                className="form-control col-md-7"
                value={search.searchString}
                name="search"
                type="search"
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <Button data-test-id="searchButton"
                disabled={!search.searchString || search.pending}
                className={search.pending ? 'loader' : ''}
                onClick={this.onSubmit}
                bsStyle='default'
                type="submit">
                <span data-test-id="text-btn-search"
                  className={search.pending ? 'invisible' : ''}>
                  <FormattedMessage id="SearchInput.button_find" />
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  onSearchStringChange (event) {
    this.props.dispatch(changeSearchString(event.target.value))
  }

  onSubmit (event) {
    event.preventDefault()
    this.props.dispatch(doSearchRequestAsync())
  }
}

function select (state) {
  return {
    lang: state.common.userLanguage,
    data: state.search
  }
}

SearchInput.propTypes = {
  data: PropTypes.object
}

export default connect(select)(SearchInput)
