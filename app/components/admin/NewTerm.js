import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {changeWylie, saveTermAsync, changeSanskrit} from '../../actions/admin/newTerm'

class NewTerm extends Component {
  constructor (props) {
    super(props)
    this.onSanskritChange = this.onSanskritChange.bind(this)
    this.onWylieChange = this.onWylieChange.bind(this)
    this.onTermSave = this.onTermSave.bind(this)
  }

  render () {
    const {pending, wylie, sanskrit} = this.props.data
    const {languages} = this.props
    return (
      <div data-test-id="NewTerm">
        <h3 data-test-id="title">
          <FormattedMessage id="NewTerm.title_new_term" />
        </h3>
        <form className="col-md-6">
          <div className="form-group">
            <input data-test-id="input-wylie"
              onChange={this.onWylieChange}
              value={wylie}
              className="form-control"
              placeholder="wylie"
              name="wylie"
              type="text"
            />
          </div>
          {
            languages && languages.map(langItem =>
              <div data-test-id="form-sanskrit" className="form-group" key={langItem.id}>
                <input data-test-id="input-sanskrit"
                  placeholder={'sanskrit_' + langItem.id + ' (' + langItem.name + ')'}
                  onChange={(event) => this.onSanskritChange(event, langItem.id)}
                  value={sanskrit['sanskrit_' + langItem.id] || ''}
                  className="form-control"
                  name={langItem.id}
                  type="text"
                />
              </div>
            )
          }
          <div className="form-group">
            <Button data-test-id="button-save"
              onClick={(event) => this.onTermSave(event)}
              className={pending ? 'loader' : ''}
              disabled={this.disabled()}
              bsStyle='primary'
              type="button"
            ><FormattedMessage id="Common.save" />
            </Button>
            <Link data-test-id="button-cancel" to={`/`}>
              <FormattedMessage id="Common.cancel" />
            </Link>
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

  onWylieChange (event) {
    this.props.dispatch(changeWylie(event.target.value))
  }

  onSanskritChange (event, langId) {
    this.props.dispatch(changeSanskrit('sanskrit_' + langId, event.target.value))
  }

  onTermSave (event) {
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
