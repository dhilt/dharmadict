import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {toggleComment} from '../../actions/search'

import editIcon from '../../styles/images/edit2.png'

class Term extends Component {
  constructor (props) {
    super(props)
    this.state = {userInfo: this.props.userInfo}
    this.onToggleComment = this.onToggleComment.bind(this)
  }

  render () {
    let translators = this.props.translators
    let term = this.props.data.term
    return (
      <div data-test-id="Term" className="term">
        <div className="term-header">
          <div data-test-id="wylie-header" className="wylie">{term.wylie}</div>
          {
            term.sanskrit_ru ? (
              <div data-test-id="sanskrit" className="sanskrit">
                <FormattedMessage id="Term.sanskrit_term"
                  values={{sanskrit_ru: term.sanskrit_ru, sanskrit_en: term.sanskrit_en}}
                />
              </div>
            ) : ( null )
          }
        </div>
        <ul className="translation-list">
        {
          term.translations.map((translation, translationIndex) =>
            <li data-test-id="translation" key={translationIndex} className="translation">
              <div className="wrap-translator-ref">
                <Link data-test-id="link-translator"
                  to={`translator/${translation.translatorId}`}
                  className="translator=ref">{translators &&
                    translators.find(elem => elem.id === translation.translatorId).name}
                </Link>
                {
                  this.canEdit(translation.translatorId) ?
                  (
                    <Link data-test-id="link-to-edit" to={{
                      pathname: '/edit',
                      query: { termId: term.id, translatorId: translation.translatorId }
                    }}><img src={editIcon} className="edit-icon" />
                    </Link>
                  ) : ( null )
                }
              </div>
              <ol data-test-id="list-meanings"
                className={"meanings" + (translation.meanings.length === 1 ? " single-item" : "")}>
              {
                translation.meanings.map((meaning, meaningIndex) =>
                <li data-test-id="meaning" key={meaningIndex} className="meaning">
                  {
                    meaning.versions.map((version, versionIndex) =>
                      <span data-test-id="version" key={versionIndex}>
                        {version + (versionIndex < meaning.versions.length - 1 ? '; ' : '')}
                      </span>
                    )
                  }
                  {
                    meaning.comment ? (
                      <a onClick={() => this.onToggleComment(translationIndex, meaningIndex)}
                        data-test-id="comment-link"
                        className="commentLink"
                      >&gt;&gt;&gt;</a>
                    ) : ( null )
                  }
                  {
                    meaning.openComment ? (
                      <span data-test-id="opened-comment" className="translation-comment">{meaning.comment}</span>
                    ) : ( null )
                  }
                </li>
                )
              }
              </ol>
            </li>
          )
        }
        </ul>
        {
          this.canAdd(term) ? (
            <div className="add-translation">
              <Link data-test-id="link-add-translation" to={{
                query: { termId: term.id, translatorId: this.state.userInfo.id },
                pathname: '/edit'}}><FormattedMessage id="Term.add_translation" />
              </Link>
            </div>
          ) : ( null )
        }
      </div>
    )
  }

  canEdit(translatorId) {
    if(!this.state.userInfo) {
      return false;
    }
    return this.state.userInfo.id === translatorId || this.state.userInfo.role === 'admin'
  }

  canAdd(term) {
    if(!this.state.userInfo || this.state.userInfo.role !== 'translator') {
      return false;
    }
    return !term.translations.find(t => t.translatorId === this.state.userInfo.id)
  }

  onToggleComment(translationIndex, meaningIndex) {
    this.props.dispatch(toggleComment(translationIndex, meaningIndex))
  }
}

Term.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object
}

function select (state) {
  return {
    userInfo: state.auth.userInfo ? state.auth.userInfo.data : null,  // ???
    translators: state.common.translators,
    lang: state.common.userLanguage,
    data: state.selected
  }
}

export default connect(select)(Term)
