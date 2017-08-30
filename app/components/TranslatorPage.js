import React, {Component} from 'react'
import {connect} from 'react-redux'

import {getTranslatorInfoAsync} from '../actions/getTranslatorInfo'

class TranslatorPage extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const name = this.props.location.query.name
    this.props.dispatch(getTranslatorInfoAsync(name))
  }

  render () {
    let translatorInfo = this.props.data
    let showTranslatorInfo = translatorInfo.pending ? (
      <h3>{'Loading...'}</h3>
    ) : (
      translatorInfo.error ? (
        <h3>{translatorInfo.error.message}</h3>
      ) : (
        <div>
          <h2>{translatorInfo.data.name}</h2>
          <h3>{'Role: ' + translatorInfo.data.role}</h3>
          <h3>{'Language of translation: ' + translatorInfo.data.language}</h3>
          <pre>{translatorInfo.data.description}</pre>
        </div>
      )
    )

    return (
      <div>
        {showTranslatorInfo}
      </div>
    )
  }
}

function select (state) {
  return {
    data: state.translatorInfo
  }
}

export default connect(select)(TranslatorPage)
