import React, {Component} from 'react'
import {connect} from 'react-redux'

import translators from '../helpers/translators'
import {toggleComment} from '../actions'

class Term extends Component {
  constructor (props) {
    super(props)
    this.toggleComment = this.toggleComment.bind(this)
  }

  render () {
    let term = this.props.data.term
    console.log(term)
    return (
      <div className="term">
        <div className="term-header">
          <div className="wylie">{term.wylie}</div>
          {
            term.sanskrit_rus ? (
              <div className="sanskrit">Санскрит: {term.sanskrit_rus}</div>
            ) : ( null )
          }
        </div>
        <ul className="translations-list">
        {
          term.translations.map((translation, translationIndex) =>
          <li key={translationIndex} className="translation">
            <div className="wrap-translator-ref">
              <a href="" className="translator-ref">{translators.getTranslator(translation.translatorId)}</a>
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
                  (<a className="commentLink" onClick={()=>this.toggleComment(translationIndex, meaningIndex)}>&gt;&gt;&gt;</a>) :
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
      </div>
    )
  }
  toggleComment(translationIndex, meaningIndex) {
    this.props.dispatch(toggleComment(translationIndex, meaningIndex))
  }
}

Term.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func
}

function select (state) {
  return {
    data: state.selected
  }
}

export default connect(select)(Term)
