import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {changeWylie, saveTermAsync, changeSanskrit} from '../../actions/admin/newTerm'

class NewTerm extends Component {
  constructor (props) {
    super(props)
    this._onWylieChange = this._onWylieChange.bind(this)
    this._onSanskritChange = this._onSanskritChange.bind(this)
    this._onTermSave = this._onTermSave.bind(this)
  }

  render () {
    const {pending, wylie, termId, sanskrit} = this.props.data
    const {languages} = this.props
    return (
      <div data-test-id="NewTerm">
        <h3 data-test-id="title"><FormattedMessage id="NewTerm.title_new_term" /></h3>
        <form data-test-id="main-form" className="col-md-6">
          <div data-test-id="form-wylie" className="form-group">
            <input data-test-id="input-wylie"
              className="form-control"
              name="wylie"
              type="text"
              placeholder="wylie"
              value={wylie}
              onChange={this._onWylieChange}/>
          </div>
          {
            languages && languages.map(langItem =>
              <div data-test-id="form-sanskrit" className="form-group" key={langItem.id}>
                <input data-test-id="input-sanskrit"
                  className="form-control"
                  name={langItem.id}
                  type="text"
                  placeholder={'sanskrit_' + langItem.id + ' (' + langItem.name + ')'}
                  onChange={(event) => this._onSanskritChange(event, langItem.id)}
                />
              </div>
            )
          }
          <div data-test-id="button-group" className="form-group">
            <Button data-test-id="button-save"
              bsStyle='primary'
              type="button"
              className={pending ? 'loader' : ''}
              disabled={this.disabled()}
              onClick={(event) => this._onTermSave(event)}
            ><FormattedMessage id="NewTerm.button_save_term" /></Button>
            <Link data-test-id="button-cancel" to={`/`}><FormattedMessage id="NewTerm.button_cancel" /></Link>
          </div>
        </form>
      </div>
    )
  }

  isSanskritOk () {
    const {sanskrit} = this.props.data
    return this.props.languages.length ===
      Object.keys(sanskrit).reduce((result, key) => result + !!sanskrit[key], 0)
  }

  disabled () {
    const {pending, wylie} = this.props.data
    return !wylie || pending || !this.isSanskritOk()
  }

  _onWylieChange (event) {
    this.props.dispatch(changeWylie(event.target.value))
  }

  _onSanskritChange (event, lingId) {
    this.props.dispatch(changeSanskrit('sanskrit_' + lingId, event.target.value))
  }

  _onTermSave (event) {
    this.props.dispatch(saveTermAsync())
  }
}

function select (state) {
  return {
    data: state.admin.newTerm,
    languages: state.common.languages
  }
}

export default connect(select)(NewTerm)
