import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import EditControls from './EditControls'

import {onVersionChanged, onVersionRemoved, onCommentChanged, onMeaningRemoved, addNewMeaning} from '../../actions/edit'

class Meanings extends Component {
  constructor (props) {
    super(props)
    this.onCommentChanged = this.onCommentChanged.bind(this)
    this.onVersionChanged = this.onVersionChanged.bind(this)
    this.onVersionRemoved = this.onVersionRemoved.bind(this)
    this.onMeaningRemoved = this.onMeaningRemoved.bind(this)
    this.addNewMeaning = this.addNewMeaning.bind(this)
  }

  render () {
    return (
      <div data-test-id="Meanings">
        <h2 data-test-id="termName">{this.props.data.termName}</h2>
        <ul className="meaningList">
          {this.props.data.change.meanings.map((meaning, meaningIndex) =>
            <li key={meaningIndex}>
              <div data-test-id="meaning" className="meaning">
                <div data-test-id="meaning-title" className="title">
                  <FormattedMessage id="Meanings.number_of_meaning" values={{indexOfMeaning: meaningIndex + 1}} />
                </div>
                <ul className="versionList">
                  {
                    meaning.versions.map((version, versionIndex) =>
                      <li data-test-id="li-version" key={versionIndex} className="form-group form-inline">
                        <input data-test-id="input-version"
                          onChange={(event) => this.onVersionChanged(event, meaningIndex, versionIndex)}
                          className="form-control"
                          value={version}
                          name="search"
                          type="text"
                        />
                        <button data-test-id="button-version"
                          disabled={versionIndex === meaning.versions.length - 1 ? 'disabled' : ''}
                          onClick={() => this.onVersionRemoved(meaningIndex, versionIndex)}
                          className="btn btn-link btn-sm remove-btn"
                          type="button">X
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
                <div className="form-group form-inline">
                  <textarea data-test-id="comment-textarea"
                    onChange={(event) => this.onCommentChanged(event, meaningIndex)}
                    value={meaning.comment || ''}
                    className="form-control"
                    name="comment"
                  />
                </div>
              </div>
              <div data-test-id="remove" className="remove">
                <a data-test-id="remove-link"
                  onClick={(event) => this.onMeaningRemoved(event, meaningIndex)}
                  className="remove-link">
                  <FormattedMessage id="Meanings.button_delete_meaning" values={{indexOfMeaning: meaningIndex + 1}} />
                </a>
              </div>
            </li>)
          }
          <li>
            {!this.props.data.change.meanings.length ? (
              <div data-test-id="div-no-meanings" className="no-meanings">
                <FormattedMessage id="Meanings.have_no_one_meaning" />
              </div>
              ) : ( null )
            }
            <a data-test-id="add-new-meaning" className="add-new-meaning" onClick={this.addNewMeaning}>
              <FormattedMessage id="Meanings.add_new_meaning" />
            </a>
          </li>
        </ul>

        <EditControls/>
      </div>
    )
  }

  onVersionChanged (event, meaningIndex, versionIndex) {
    this.props.dispatch(onVersionChanged(meaningIndex, versionIndex, event.target.value))
  }

  onVersionRemoved (meaningIndex, versionIndex) {
    this.props.dispatch(onVersionRemoved(meaningIndex, versionIndex))
  }

  onCommentChanged (event, meaningIndex) {
    this.props.dispatch(onCommentChanged(meaningIndex, event.target.value))
  }

  onMeaningRemoved (event, meaningIndex) {
    event.preventDefault()
    this.props.dispatch(onMeaningRemoved(meaningIndex))
  }

  addNewMeaning (event) {
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
