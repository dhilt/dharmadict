import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import lang from '../helpers/lang'
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
    const {languages, userLanguage} = this.props.common
    const translatorLang = languages && languages.find(elem => elem.id === translator.language)
    return (
      <div>
        <h3>{translator.name}</h3>
        <h4><FormattedMessage
          id="TranslatorPage.translations_language"
          values={{translatorLanguage: translatorLang ? translatorLang['name_' + lang.get(userLanguage)] : ''}}
        /></h4>
        <pre>{translator.description}</pre>
        {
          userData && userData.role === 'admin' &&
          <Link className="btn btn-default" to={`/translator/${translatorId}/edit`}>
            <FormattedMessage id="TranslatorPage.button_edit" />
          </Link>
        }
      </div>
    )
  }

  render () {
    const {translatorInfo} = this.props
    let content = translatorInfo.pending ? (
      <h3><FormattedMessage id="TranslatorPage.loading_text" /></h3>
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
    common: state.common
  }
}

export default connect(select)(TranslatorPage)
