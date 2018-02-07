import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {getAllPagesAsync} from '../actions/pages'

class Pages extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount () {
    this.props.dispatch(getAllPagesAsync())
  }

  render () {
    const { pending, list } = this.props.pages
    const { userData } = this.props
    return (
      <div data-test-id="Pages">
        <h3><FormattedMessage id="Pages.title" /></h3>
        {
          !pending &&
          <ul data-test-id="list-pages">
            { list.map((page, i) => <li key={i}><Link to={`/pages/${page.url}`}>{page.title}</Link></li>) }
          </ul>
        }
        {
          userData && userData.role === 'admin' &&
          <div data-test-id="link-to-create">
            <Link className="btn btn-default" to={`/pages/new`}>
              <FormattedMessage id="Pages.link_to_create" />
            </Link>
          </div>
        }
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    pages: state.pages,
    userData: state.auth.userInfo.data
  }
}

export default connect(select)(Pages)
