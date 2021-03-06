import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'
import {ButtonToolbar, SplitButton, MenuItem} from 'react-bootstrap'

import {changePageData, resetPage, getPageForEditAsync, updatePageAsync, removePageAsync} from '../../actions/pages/changePage'

class EditPage extends Component {

  constructor(props) {
    super(props)
    this.sendNewPageData = this.sendNewPageData.bind(this)
    this.changePageAuthor = this.changePageAuthor.bind(this)
    this.changePageTitle = this.changePageTitle.bind(this)
    this.changePageText = this.changePageText.bind(this)
    this.changePageBio = this.changePageBio.bind(this)
    this.resetChanges = this.resetChanges.bind(this)
    this.deletePage = this.deletePage.bind(this)
  }

  componentWillMount () {
    this.props.userInfo.promise.then(() => {
      this.props.dispatch(getPageForEditAsync(this.props.params.pageUrl))
    })
  }

  resetChanges (event) {
    event.preventDefault()
    this.props.dispatch(resetPage())
  }

  deletePage (event) {
    event.preventDefault()
    this.props.dispatch(removePageAsync())
  }

  sendNewPageData (event) {
    event.preventDefault()
    this.props.dispatch(updatePageAsync())
  }

  changePageTitle (event) {
    this.props.dispatch(changePageData({title: event.target.value}))
  }

  changePageBio () {
    this.props.dispatch(changePageData({bio: !this.props.pageInfo.data.bio}))
  }

  changePageAuthor (userId) {
    this.props.dispatch(changePageData({author: userId}))
  }

  changePageText (event) {
    this.props.dispatch(changePageData({text: event.target.value}))
  }

  render () {
    const { userInfo, userList } = this.props
    const { noPermission, sourcePending, removePending, pending } = this.props.pageInfo
    const { author, title, text, bio } = this.props.pageInfo.data
    const authorUser = userList.find(u => u.id === author)
    const authorName = authorUser ? authorUser.name : ''
    return !sourcePending && !noPermission && (
      <div data-test-id="EditPage">
        <form className="col-md-6">
          <h3><FormattedMessage id="EditPage.title_of_page" /></h3>
          <div className="form-group">
            <label><FormattedMessage id="EditPage.edit_title" /></label>
            <input data-test-id="input-title"
              onChange={this.changePageTitle}
              className="form-control"
              value={title || ''}
              type="text"
            />
          </div>
          <div className="form-group">
            <label><FormattedMessage id="EditPage.edit_text" /></label>
            <textarea data-test-id="input-text"
              className="form-control page-textarea"
              onChange={this.changePageText}
              value={text || ''}
              type="text"
            />
          </div>
            {
              userList.length && userInfo.data.role === 'admin' && (
                <div className="form-group">
                  <label><FormattedMessage id="EditPage.page_author" /></label>
                  <ButtonToolbar>
                    <SplitButton id="authorId" title={authorName}>
                      {userList.map((user, i) =>
                        <MenuItem data-test-id={`input-author-${i}`} key={i}
                                  onSelect={() => this.changePageAuthor(user.id)}
                        >{user.name} ({user.id})
                        </MenuItem>
                      )}
                    </SplitButton>
                  </ButtonToolbar>
                </div>
              )
            }
          <div className="form-group">
            <label><FormattedMessage id="EditPage.biography_page" /></label>
            <div>
              <input data-test-id="input-bio"
                     className="bio-checkbox"
                     onChange={this.changePageBio}
                     checked={bio}
                     type="checkbox"
                     disabled={authorUser && authorUser.role === 'admin'}
              />
            </div>
          </div>
          <div className="form-group">
            <button data-test-id="btn-save"
              className="btn btn-primary"
              onClick={this.sendNewPageData}
              disabled={pending}>
              <FormattedMessage id="Common.save" />
            </button>
            <button data-test-id="btn-reset"
              className="btn btn-default"
              onClick={this.resetChanges}>
              <FormattedMessage id="Common.reset" />
            </button>
            <button data-test-id="btn-delete"
              className="btn btn-danger"
              onClick={this.deletePage}
              disabled={removePending}>
              <FormattedMessage id="Common.delete" />
            </button>
            <Link data-test-id="link-cancel"
              to={`/pages/${this.props.params.pageUrl}`}>
              <FormattedMessage id="Common.cancel" />
            </Link>
          </div>
        </form>
      </div>
    )
  }
}

function select (state) {
  const userInfo = state.auth.userInfo
  return {
    userList: [
      ...(userInfo.data && userInfo.data.role === 'admin' ? [userInfo.data] : []),
      ...(state.common.translators || [])
    ],
    pageInfo: state.admin.editPage,
    userInfo
  }
}

export default connect(select)(EditPage)
