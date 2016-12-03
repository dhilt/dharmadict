import React, {Component} from 'react'
import {connect} from 'react-redux'

import translators from '../helpers/translators'
import {doSearchRequestAsync} from '../actions'

class Term extends Component {
  constructor (props) {
    super(props)
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
          term.translations.map((item, i) =>
          <li key={i} className="translation">
            <div className="wrap-translator-ref">
              <a href="" className="translator-ref">{translators.getTranslator(item.translatorId)}</a>
            </div>
            <ol className={"meanings" + (item.meanings.length === 1 ? " single-item" : "")}>
            {
              item.meanings.map((meaning, i) =>
              <li key={i} className="meaning">
                {
                  meaning.versions.map((version, i) =>
                    <span key={i}>
                      {version + (i < meaning.versions.length - 1 ? '; ' : '')}
                    </span>
                  )
                }
                {
                  meaning.comment ?
                  (<a className="commentLink">&gt;&gt;&gt;</a>) :
                  ( null )
                }
                <span id="{{'comment-'+translatorIndex+'-'+$index}}" className="translation-comment hidden">
                  {meaning.comment}
                </span>
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
