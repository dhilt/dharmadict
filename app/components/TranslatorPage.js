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

  getTranslatorContent (data) {
    const userInfo = this.props.userInfo.data
    return (
      <div>
        <h3>{data.name}</h3>
        <h4>{'Язык переводов: ' + (data.language == 'rus' ? 'русский' : 'английский')}</h4>
        <pre>{data.description}</pre>
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
    data: state.translatorInfo,
    userInfo: state.auth.userInfo
  }
}

export default connect(select)(TranslatorPage)
