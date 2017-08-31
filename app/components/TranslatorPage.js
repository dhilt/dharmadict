import React, {Component} from 'react'
import {connect} from 'react-redux'

import {getTranslatorInfoAsync} from '../actions/translators'

class TranslatorPage extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const name = this.props.location.query.name
    this.props.dispatch(getTranslatorInfoAsync(name))
  }

  getTranslatorContent (data) {
    return (
      <div>
        <h3>{data.name}</h3>
        <h4>{'Язык переводов: ' + (data.language == 'rus' ? 'русский' : 'английский')}</h4>
        <pre>{data.description}</pre>
      </div>
    )
  }

  render () {
    let data = this.props.data
    let content = data.pending ? (
      <h3>{'Loading...'}</h3>
    ) : (
      data.error ? (
        <h3>{data.error.message}</h3>
      ) :
        this.getTranslatorContent(data.data)
    )
    return (
      <div>{content}</div>
    )
  }
}

function select (state) {
  return {
    data: state.translatorInfo
  }
}

export default connect(select)(TranslatorPage)
