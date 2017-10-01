import {connect} from 'react-redux'
import {IntlProvider, addLocaleData} from 'react-intl'

import en from 'react-intl/locale-data/en'
import ru from 'react-intl/locale-data/ru'
addLocaleData([...en, ...ru])

function mapStateToProps(state) {
  const userLanguage = state.common.userLanguage
  const messages = require('./i18n/' + userLanguage)
  return { locale: userLanguage, messages }
}

export default connect(mapStateToProps)(IntlProvider)
