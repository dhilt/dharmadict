import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Button } from 'react-bootstrap';

import {changeSearchString} from '../../actions'

class SearchInput extends Component {
  constructor (props) {
    super(props)
    this._onSearchStringChange = this._onSearchStringChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  render () {
    return (
      <div className='row'>
        <form>
          <div className='form-group'>
            <div className='col-md-6'>
              <input className='form-control col-md-7'
                name='search' type='search'
                value={this.props.data.searchString}
                onChange={this._onSearchStringChange}/>
            </div>
          </div>
          <div className='col-md-2'>
            <div className='form-group'>
              <Button
                bsStyle='default'
                type='submit'
                disabled={!this.props.data.searchString}
                onClick={this._onSubmit}>
                Найти
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
    this.props.onSubmit(this.props.data.searchString)
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
