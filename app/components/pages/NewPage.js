import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {changePageData, createPageAsync} from '../../actions/pages/newPage'

class NewPage extends Component {

  constructor(props) {
    super(props)
    this.sendNewPageData = this.sendNewPageData.bind(this)
    this.changePageTitle = this.changePageTitle.bind(this)
    this.changePageText = this.changePageText.bind(this)
    this.changePageBio = this.changePageBio.bind(this)
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

  changePageBio () {
    this.props.dispatch(changePageData({bio: !this.props.pageInfo.data.bio}))
  }

  changePageText (event) {
    this.props.dispatch(changePageData({text: event.target.value}))
  }

  render () {
    const { pending } = this.props.pageInfo
    const { url, title, bio, text } = this.props.pageInfo.data
    return (
      <div data-test-id="NewPage">
        <form className="col-md-6">
          <h3><FormattedMessage id="NewPage.title_of_page" /></h3>
          <div className="form-group">
            <label><FormattedMessage id="NewPage.edit_url" /></label>
            <input data-test-id="input-url"
              type="text"
              value={url || ''}
              className="form-control"
              onChange={this.changePageUrl}
            />
          </div>
          <div className="form-group">
            <label><FormattedMessage id="NewPage.edit_title" /></label>
            <input data-test-id="input-title"
              onChange={this.changePageTitle}
              className="form-control"
              value={title || ''}
              type="text"
            />
          </div>
          <div className="form-check">
            <input data-test-id="input-bio"
              onChange={this.changePageBio}
              checked={bio || false}
              type="checkbox"
            />
            <label>It's biography page</label>
          </div>
          <div className="form-group">
            <label><FormattedMessage id="NewPage.edit_text" /></label>
            <textarea data-test-id="input-text"
              className="form-control page-textarea"
              onChange={this.changePageText}
              value={text || ''}
              type="text"
            />
          </div>
          <div className="form-group">
            <button data-test-id="btn-save"
              onClick={this.sendNewPageData}
              className="btn btn-primary"
              disabled={pending}>
              <FormattedMessage id="Common.save" />
            </button>
            <Link data-test-id="link-cancel" to={`/pages`}>
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
