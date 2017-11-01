import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {FormattedMessage} from 'react-intl'

import {changeSearchString, doSearchRequestAsync} from '../../actions/search'

class SearchInput extends Component {
  constructor (props) {
    super(props)
    this._onSearchStringChange = this._onSearchStringChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  render () {
    let search = this.props.data
    return (
      <div data-test-id="SearchInput" className='row'>
        <form data-test-id="main-form">
          <div data-test-id="form-group1" className='form-group'>
            <div data-test-id="form-group1.col-md-6" className='col-md-6'>
              <input className='form-control col-md-7'
                data-test-id="form-group1.input"
                name='search' type='search'
                value={search.searchString}
                onChange={this._onSearchStringChange}/>
            </div>
          </div>
          <div data-test-id="div.col-md-2" className='col-md-2'>
            <div data-test-id="form-group2" className='form-group'>
              <Button
                data-test-id="searchButton"
                bsStyle='default'
                type='submit'
                className={search.pending ? 'loader' : ''}
                disabled={!search.searchString || search.pending}
                onClick={this._onSubmit}>
                <span data-test-id="button-pending" className={search.pending ? 'invisible' : ''}>
                  <FormattedMessage id="SearchInput.button_find" />
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  _onSearchStringChange (event) {
    this.props.dispatch(changeSearchString(event.target.value))
  }

  _onSubmit (event) {
    event.preventDefault()
    this.props.dispatch(doSearchRequestAsync())
  }
}

function select (state) {
  return {
    data: state.search,
    lang: state.common.userLanguage
  }
}

SearchInput.propTypes = {
  data: PropTypes.object
}

export default connect(select)(SearchInput)
