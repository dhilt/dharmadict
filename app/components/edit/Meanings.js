import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import EditControls from './EditControls'

import {onVersionChanged, onVersionRemoved, onCommentChanged, onMeaningRemoved, addNewMeaning} from '../../actions/edit'

class Meanings extends Component {
  constructor (props) {
    super(props)
    this._onVersionChanged = this._onVersionChanged.bind(this)
    this._onVersionRemoved = this._onVersionRemoved.bind(this)
    this._onCommentChanged = this._onCommentChanged.bind(this)
    this._onMeaningRemoved = this._onMeaningRemoved.bind(this)
    this._addNewMeaning = this._addNewMeaning.bind(this)
  }

  render () {
    return (
      <div data-test-id="Meanings">
        <h2 data-test-id="termName">{this.props.data.termName}</h2>
        <ul data-test-id="meaningList" className="meaningList">
        {
          this.props.data.change.meanings.map((meaning, meaningIndex) =>
          <li data-test-id="li-meaning" key={meaningIndex}>
            <div data-test-id="meaning" className="meaning">
              <div data-test-id="meaning-title" className="title">
                <FormattedMessage id="Meanings.number_of_meaning" values={{indexOfMeaning: meaningIndex +1}} />
              </div>
              <ul data-test-id="versionList" className="versionList">
              {
                meaning.versions.map((version, versionIndex) =>
                  <li data-test-id="li-version" key={versionIndex} className="form-group form-inline">
                    <input data-test-id="input-version" className="form-control" name="search" type="text"
                      value={version}
                      onChange={(event) => this._onVersionChanged(event, meaningIndex, versionIndex)}/>
                    <button data-test-id="button-version" className="btn btn-link btn-sm remove-btn" type="button"
                        disabled={versionIndex === meaning.versions.length - 1 ? "disabled" : ""}
                        onClick={() => this._onVersionRemoved(meaningIndex, versionIndex)}>X
                    </button>
                  </li>
                )
              }
              </ul>
            </div>
            <div data-test-id="comment" className="comment">
              <span data-test-id="comment-title" className="title">
                <FormattedMessage id="Meanings.comment_for_meaning" values={{indexOfMeaning: meaningIndex + 1}} />
              </span>
              <div data-test-id="comment-group" className="form-group form-inline">
                <textarea data-test-id="comment-textarea" className="form-control" name="comment"
                  value={meaning.comment || ''}
                  onChange={(event) => this._onCommentChanged(event, meaningIndex)}/>
              </div>
            </div>
            <div data-test-id="remove" className="remove">
              <a data-test-id="remove-link" className="remove-link"
                onClick={(event) => this._onMeaningRemoved(event, meaningIndex)}>
                <FormattedMessage id="Meanings.button_delete_meaning" values={{indexOfMeaning: meaningIndex + 1}} />
              </a>
            </div>
          </li>
          )
        }
          <li data-test-id="li-no-meanings">
            {
              !this.props.data.change.meanings.length ? (
                <div data-test-id="div-no-meanings" className="no-meanings">
                  <FormattedMessage id="Meanings.have_no_one_meaning" />
                </div>
              ) : ( null )
            }
            <a data-test-id="add-new-meaning" className="add-new-meaning" onClick={this._addNewMeaning}>
              <FormattedMessage id="Meanings.add_new_meaning" />
            </a>
          </li>
        </ul>

        <EditControls/>

      </div>
    )
  }

  _onVersionChanged (event, meaningIndex, versionIndex) {
    this.props.dispatch(onVersionChanged(meaningIndex, versionIndex, event.target.value))
  }

  _onVersionRemoved (meaningIndex, versionIndex) {
    this.props.dispatch(onVersionRemoved(meaningIndex, versionIndex))
  }

  _onCommentChanged (event, meaningIndex) {
    this.props.dispatch(onCommentChanged(meaningIndex, event.target.value))
  }

  _onMeaningRemoved (event, meaningIndex) {
    event.preventDefault()
    this.props.dispatch(onMeaningRemoved(meaningIndex))
  }

  _addNewMeaning (event) {
    event.preventDefault()
    this.props.dispatch(addNewMeaning())
  }
}

function select (state) {
  return {
    data: state.edit,
    userLang: state.common.userLanguage
  }
}

export default connect(select)(Meanings)
