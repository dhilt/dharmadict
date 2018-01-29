import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {getPageAsync} from '../../actions/pages'

class Page extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount () {
    this.props.dispatch(getPageAsync(this.props.params.pageUrl))
  }

  render () {
    const { page, pending } = this.props.pageInfo
    const { userData } = this.props
    return !pending && page && (
      <div>
        <h3>{page.title}</h3>
        <article>{page.text}</article>
        {
          userData && userData.role === 'admin' &&
          <div>
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
