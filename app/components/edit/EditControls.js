import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'

import {resetTranslation, saveTranslationAsync} from '../../actions/edit'

class EditControls extends Component {
  constructor (props) {
    super(props)
    this._onCancel = this._onCancel.bind(this)
    this._onSave = this._onSave.bind(this)
  }

  render () {
    return (
      <div className="form-group form-inline">
        <Button
          bsStyle='primary'
          type="button"
          className={this.props.data.pending ? 'loader' : ''}
          disabled={this.props.data.pending}
          onClick={(event) => this._onSave(event, true)}>
          Сохранить и закрыть
        </Button>
        <Button
          bsStyle='primary'
          type="button"
          className={this.props.data.pending ? 'loader' : ''}
          disabled={this.props.data.pending}
          onClick={this._onSave}>
          Сохранить
        </Button>
        <a
          className="cancel-link"
          onClick={this._onCancel}>
          Сбросить
        </a>
      </div>
    )
  }

  _onCancel (event) {
    event.preventDefault()
    this.props.dispatch(resetTranslation())
  }

  _onSave (event, shouldClose) {
    this.props.dispatch(saveTranslationAsync(shouldClose))
  }
}

function select (state) {
  return {
    data: state.edit.update
  }
}

export default connect(select)(EditControls)
