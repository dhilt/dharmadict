import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router'

import {changeTerm, saveTermAsync} from '../actions/newTerm'

class NewTerm extends Component {
  constructor (props) {
    super(props)
    this._onTermChange = this._onTermChange.bind(this)
    this._onTermSave = this._onTermSave.bind(this)
  }

  render () {
    return (
      <div>
        <h3>Новый термин</h3>
        <div className="form-group col-md-4">
          <input className="form-control" name="term" type="text"
            value={this.props.term}
            onChange={this._onTermChange}/>
        </div>
        <div className="form-group form-inline">
          <Button
            bsStyle='primary'
            type="button"
            className={this.props.data.pending ? 'loader' : ''}
            disabled={!this.props.data.term || this.props.data.pending}
            onClick={(event) => this._onTermSave(event)}>
            Сохранить
          </Button> &nbsp;
          <Link to={`/`}>Отмена</Link>
        </div>
      </div>
    )
  }

  _onTermChange (event) {
    this.props.dispatch(changeTerm(event.target.value))
  }

  _onTermSave (event) {
    this.props.dispatch(saveTermAsync())
  }
}

function select (state) {
  return {
    data: state.newTerm
  }
}

export default connect(select)(NewTerm)
