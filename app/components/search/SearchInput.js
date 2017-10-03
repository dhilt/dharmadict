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
      <div className='row'>
        <form>
          <div className='form-group'>
            <div className='col-md-6'>
              <input className='form-control col-md-7'
                name='search' type='search'
                value={search.searchString}
                onChange={this._onSearchStringChange}/>
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <Button
                bsStyle='default'
                type='submit'
                className={search.pending ? 'loader' : ''}
                disabled={!search.searchString || search.pending}
                onClick={this._onSubmit}>
                <span className={search.pending ? 'invisible' : ''}>
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
    lang: state.common.userLang
  }
}

SearchInput.propTypes = {
  data: PropTypes.object
}

export default connect(select)(SearchInput)
