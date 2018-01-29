import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import {getAllPagesAsync} from '../../actions/pages'

class PagesList extends Component {

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
      <div>
        <h3><FormattedMessage id="PagesList.title" /></h3>
        {
          userData && userData.role === 'admin' &&
          <Link className="btn btn-default" to={`/pages/new`}>
            <FormattedMessage id="PagesList.link_to_create" />
          </Link>
        }
        {
          !pending &&
          <ul>
            { list.map((page, i) => <li key={i}><Link to={`/pages/${page.url}`}>{page.title}</Link></li>) }
          </ul>
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

export default connect(select)(PagesList)
