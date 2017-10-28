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
    this.userInfo = this.props.userInfo
    this._toggleComment = this._toggleComment.bind(this)
  }

  render () {
    let translators = this.props.translators
    let term = this.props.data.term
    return (
      <div data-test-id="Term" className="term">
        <div className="term-header">
          <div className="wylie">{term.wylie}</div>
          {
            term.sanskrit_ru ? (
              <div className="sanskrit">
                <FormattedMessage
                  id="Term.sanskrit_term"
                  values={{sanskrit_ru: term.sanskrit_ru, sanskrit_en: term.sanskrit_en}}
                />
              </div>
            ) : ( null )
          }
        </div>
        <ul className="translation-list">
        {
          term.translations.map((translation, translationIndex) =>
          <li key={translationIndex} className="translation">
            <div className="wrap-translator-ref">
              <Link to={`translator/${translation.translatorId}`} className="translator=ref">
                {translators &&
                  translators.find(elem => elem.id === translation.translatorId).name
                }
              </Link>
              {
                this.canEdit(translation.translatorId) ?
                (
                  <Link to={{
                    pathname: '/edit',
                    query: { termId: term.id, translatorId: translation.translatorId }
                  }}>
                      <img src={editIcon} className="edit-icon" />
                  </Link>
                ) : ( null )
              }
            </div>
            <ol className={"meanings" + (translation.meanings.length === 1 ? " single-item" : "")}>
            {
              translation.meanings.map((meaning, meaningIndex) =>
              <li key={meaningIndex} className="meaning">
                {
                  meaning.versions.map((version, versionIndex) =>
                    <span key={versionIndex}>
                      {version + (versionIndex < meaning.versions.length - 1 ? '; ' : '')}
                    </span>
                  )
                }
                {
                  meaning.comment ?
                  (<a className="commentLink" onClick={()=>this._toggleComment(translationIndex, meaningIndex)}>&gt;&gt;&gt;</a>) :
                  ( null )
                }
                {
                  meaning.openComment ?
                  (<span className="translation-comment"> {meaning.comment} </span>) :
                  ( null )
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
              <Link to={{
                pathname: '/edit',
                query: { termId: term.id, translatorId: this.userInfo.id }
              }}>
                <FormattedMessage id="Term.add_translation" />
              </Link>
            </div>
          ) : ( null )
        }
      </div>
    )
  }

  canEdit(translatorId) {
    if(!this.userInfo) {
      return false;
    }
    return this.userInfo.id === translatorId || this.userInfo.role === 'admin'
  }

  canAdd(term) {
    if(!this.userInfo || this.userInfo.role !== "translator") {
      return false;
    }
    return !term.translations.find(t => t.translatorId === this.userInfo.id)
  }

  _toggleComment(translationIndex, meaningIndex) {
    this.props.dispatch(toggleComment(translationIndex, meaningIndex))
  }
}

Term.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func
}

function select (state) {
  return {
    translators: state.common.translators,
    data: state.selected,
    userInfo: state.auth.userInfo ? state.auth.userInfo.data : null,
    lang: state.common.userLanguage
  }
}

export default connect(select)(Term)
