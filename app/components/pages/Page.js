import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

class Page extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    const { page, pending } = this.props.pageInfo
    const { userData } = this.props
    return !pending && page && (
      <div data-test-id="Page">
        <h3 data-test-id="title">{page.title}</h3>
        <article data-test-id="text" dangerouslySetInnerHTML={{__html: page.text}} />
        {
          userData && (userData.role === 'admin' || (userData.role === 'translator' && userData.id === page.author)) &&
          <div data-test-id="link-to-edit">
            <Link className="btn btn-default" to={`/pages/${page.url}/edit`}>
              <span><FormattedMessage id="EditPage.link_to_edit" /></span>
            </Link>
          </div>
        }
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    userData: state.auth.userInfo.data,
    pageInfo: state.pages.current
  }
}

export default connect(select)(Page)
