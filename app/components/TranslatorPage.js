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

  getTranslatorContent (translator, languages) {
    const userInfo = this.props.userInfo.data
    return (
      <div>
        <h3>{translator.name}</h3>
        <h4>{'Язык переводов: ' + ((translator.language && languages) ?
          languages.find(elem => elem.id === translator.language).name_rus : '')}
        </h4>
        <pre>{translator.description}</pre>
        {
          userInfo && userInfo.role === 'admin' &&
          <Link className="btn btn-default" to={`/translator/${this.props.params.id}/edit`}>
            Редактировать
          </Link>
        }
      </div>
    )
  }

  render () {
    const {data, languages} = this.props
    let content = data.pending ? (
      <h3>{'Loading...'}</h3>
    ) : (
      data.error ? (
        <h3>{data.error.message}</h3>
      ) :
        this.getTranslatorContent(data.data, languages)
    )
    return (
      <div>{content}</div>
    )
  }
}

function select (state) {
  return {
    data: state.translatorInfo,
    userInfo: state.auth.userInfo,
    languages: state.common.languages
  }
}

export default connect(select)(TranslatorPage)
