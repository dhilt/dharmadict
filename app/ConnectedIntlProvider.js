import {connect} from 'react-redux'
import {IntlProvider, addLocaleData} from 'react-intl'

import en from 'react-intl/locale-data/en'
import ru from 'react-intl/locale-data/ru'

import lang from './helpers/lang'

addLocaleData([...en, ...ru])

function mapStateToProps(state) {
  const language = lang.get(localStorage.getItem('userLanguage'))
  const messages = require('./i18n/' + language)
  return { locale: language, messages }
}

export default connect(mapStateToProps)(IntlProvider)
