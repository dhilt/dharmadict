import {connect} from 'react-redux'
import {IntlProvider, addLocaleData} from 'react-intl'

import en from 'react-intl/locale-data/en'
import ru from 'react-intl/locale-data/ru'

import lang from './helpers/lang'
import i18n from './helpers/i18n'

addLocaleData([...en, ...ru])

function mapStateToProps(state) {
  const language = lang.getUserLanguage()
  return { locale: language, messages: i18n.data[language] }
}

export default connect(mapStateToProps)(IntlProvider)
