import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {FormattedMessage} from 'react-intl'

import {resetTranslation, saveTranslationAsync} from '../../actions/edit'

class EditControls extends Component {
  constructor (props) {
    super(props)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  render () {
    return (
      <div data-test-id="EditControls" className="form-group form-inline">
        <Button data-test-id="button-save-and-close"
          className={this.props.data.pending ? 'loader' : ''}
          onClick={(event) => this.onSave(event, true)}
          disabled={this.props.data.pending}
          bsStyle='primary'
          type="button">
          <FormattedMessage id="EditControls.button_save_and_close" />
        </Button>
        <Button data-test-id="button-save"
          className={this.props.data.pending ? 'loader' : ''}
          disabled={this.props.data.pending}
          onClick={this.onSave}
          bsStyle='primary'
          type="button">
          <FormattedMessage id="EditControls.button_save" />
        </Button>
        <a data-test-id="cancel-link"
          onClick={this.onCancel}
          className="cancel-link">
          <FormattedMessage id="EditControls.button_reset" />
        </a>
      </div>
    )
  }

  onCancel (event) {
    event.preventDefault()
    this.props.dispatch(resetTranslation())
  }

  onSave (event, shouldClose) {
    this.props.dispatch(saveTranslationAsync(shouldClose))
  }
}

function select (state) {
  return {
    data: state.edit.update,
    userLang: state.common.userLanguage
  }
}

export default connect(select)(EditControls)
