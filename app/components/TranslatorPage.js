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
      <div data-test-id="translatorContent">
        <h3 data-test-id="name">{translator.name}</h3>
        <h4 data-test-id="language"><FormattedMessage
          id="TranslatorPage.translations_language"
          values={{translatorLanguage: translatorLang ? translatorLang['name_' + lang.get(userLanguage)] : ''}}
        /></h4>
        <pre data-test-id="description">{translator.description}</pre>
        {
          userData && userData.role === 'admin' &&
          <Link data-test-id="changeUser" className="btn btn-default" to={`/translator/${translatorId}/edit`}>
            <FormattedMessage id="TranslatorPage.button_edit" />
          </Link>
        }
        {
          userData && userData.role === 'translator' && userData.id === translatorId &&
          <Link data-test-id="changeTranslatorPassword" className="btn btn-default" to={`/translator/${translatorId}/password`}>
            <FormattedMessage id="TranslatorPage.button_edit_password" />
          </Link>
        }
      </div>
    )
  }

  render () {
    const {translatorInfo} = this.props
    let content = translatorInfo.pending ? (
      <h3 data-test-id="pending"><FormattedMessage id="TranslatorPage.loading_text" /></h3>
    ) : (
      translatorInfo.error ? (
        <h3 data-test-id="error">{translatorInfo.error.message}</h3>
      ) :
        this.getTranslatorContent(translatorInfo.data)
    )
    return (
      <div data-test-id="TranslatorPage">{content}</div>
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
