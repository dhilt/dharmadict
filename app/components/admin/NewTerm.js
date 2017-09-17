import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router'

import {changeTerm, saveTermAsync} from '../../actions/admin/newTerm'

class NewTerm extends Component {
  constructor (props) {
    super(props)
    this._onTermChange = this._onTermChange.bind(this)
    this._onTermSave = this._onTermSave.bind(this)
  }

  render () {
    const {error, pending, term, termId} = this.props.data
    return (
      <div>
        <h3>{'Новый термин'}</h3>
        <div className="form-group col-md-4">
          <input className="form-control" name="term" type="text"
            value={term}
            onChange={this._onTermChange}/>
        </div>
        <div className="form-group form-inline">
          <Button
            bsStyle='primary'
            type="button"
            className={pending ? 'loader' : ''}
            disabled={!term || pending}
            onClick={(event) => this._onTermSave(event)}
          >{'Сохранить'}</Button>
          <Link to={`/`}>{'Отмена'}</Link>
        </div>
        {error && <div className="alert alert-danger col-md-4">{error.message}</div>}
        {!error && termId && <div className="alert alert-success col-md-4">{`Term was created with id: ${termId}`}</div>}
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
    data: state.admin.newTerm
  }
}

export default connect(select)(NewTerm)
