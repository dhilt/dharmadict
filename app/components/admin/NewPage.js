import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {changePageData, createPageAsync} from '../../actions/admin/newPage'

class NewPage extends Component {

  constructor(props) {
    super(props)
    this.sendNewPageData = this.sendNewPageData.bind(this)
    this.changePageTitle = this.changePageTitle.bind(this)
    this.changePageText = this.changePageText.bind(this)
    this.changePageUrl = this.changePageUrl.bind(this)
  }

  sendNewPageData (event) {
    event.preventDefault()
    this.props.dispatch(createPageAsync())
  }

  changePageUrl (event) {
    this.props.dispatch(changePageData({url: event.target.value}))
  }

  changePageTitle (event) {
    this.props.dispatch(changePageData({title: event.target.value}))
  }

  changePageText (event) {
    this.props.dispatch(changePageData({text: event.target.value}))
  }

  render () {
    const { pending } = this.props.pageInfo
    const { url, title, text } = this.props.pageInfo.data
    return (
      <div>
        <form className="col-md-6">
          <h3><FormattedMessage id="NewPage.title_of_page" /></h3>
          <div className="form-group">
            <label><FormattedMessage id="NewPage.edit_url" /></label>
            <input type="text"
              value={url || ''}
              className="form-control"
              onChange={this.changePageUrl}
            />
          </div>
          <div className="form-group">
            <label><FormattedMessage id="NewPage.edit_title" /></label>
            <input type="text"
              value={title || ''}
              className="form-control"
              onChange={this.changePageTitle}
            />
          </div>
          <div className="form-group">
            <label><FormattedMessage id="NewPage.edit_text" /></label>
            <textarea type="text"
              value={text || ''}
              className="form-control page-textarea"
              onChange={this.changePageText}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary"
              onClick={this.sendNewPageData}
              disabled={pending}>
              <FormattedMessage id="Common.save" />
            </button>
            <Link to={`/pages`}>
              <FormattedMessage id="Common.cancel" />
            </Link>
          </div>
        </form>
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    pageInfo: state.admin.newPage
  }
}

export default connect(select)(NewPage)
