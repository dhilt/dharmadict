import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {getTranslatorInfoAsync} from '../actions/translators'

class TranslatorPage extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const userId = this.props.params.id
    this.props.dispatch(getTranslatorInfoAsync(userId))
  }

  getTranslatorContent (translator) {
    const translatorId = this.props.params.id // translator.id ??
    const userData = this.props.userInfo.data
    const languages = this.props.languages
    return (
      <div>
        <h3>{translator.name}</h3>
        <h4>{'Язык переводов: ' + ((translator.language && languages) ?
          languages.find(elem => elem.id === translator.language).name_rus : '')}
        </h4>
        <pre>{translator.description}</pre>
        {
          userData && userData.role === 'admin' &&
          <Link className="btn btn-default" to={`/translator/${translatorId}/edit`}>
            Редактировать
          </Link>
        }
      </div>
    )
  }

  render () {
    const {translatorInfo} = this.props
    let content = translatorInfo.pending ? (
      <h3>{'Loading...'}</h3>
    ) : (
      translatorInfo.error ? (
        <h3>{translatorInfo.error.message}</h3>
      ) :
        this.getTranslatorContent(translatorInfo.data)
    )
    return (
      <div>{content}</div>
    )
  }
}

function select (state) {
  return {
    translatorInfo: state.translatorInfo,
    userInfo: state.auth.userInfo,
    languages: state.common.languages
  }
}

export default connect(select)(TranslatorPage)
