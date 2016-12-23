import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Button } from 'react-bootstrap';

import {changeSearchString, doSearchRequestAsync} from '../../actions/search'

class SearchInput extends Component {
  constructor (props) {
    super(props)
    this._onSearchStringChange = this._onSearchStringChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  render () {
    let searchState = this.props.data
    return (
      <div className='row'>
        <form>
          <div className='form-group'>
            <div className='col-md-6'>
              <input className='form-control col-md-7'
                name='search' type='search'
                value={searchState.searchString}
                onChange={this._onSearchStringChange}/>
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <Button
                bsStyle='default'
                type='submit'
                className={searchState.pending ? 'loader' : ''}
                disabled={!searchState.searchString || searchState.pending}
                onClick={this._onSubmit}>
                <span className={searchState.pending ? 'invisible' : ''}>
                  Найти
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
    data: state.searchState
  }
}

SearchInput.propTypes = {
  data: React.PropTypes.object,
  onSubmit: React.PropTypes.func
}

export default connect(select)(SearchInput)
