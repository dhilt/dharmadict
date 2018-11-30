import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import {getAllTermsAsync} from '../actions/terms'

class Terms extends Component {
  componentWillMount () {
    if (this.props.terms.list.length === 0) {
      this.props.dispatch(getAllTermsAsync())
    }
  }

  render () {
    const {terms} = this.props
    return (
      <div data-test-id="Terms">
        <h3><FormattedMessage id="Terms.heading" /></h3>
        {terms.list.length > 0 &&
          <table className="terms-table">
            <thead>
              <tr>
                <td></td>
                <td><FormattedMessage id="Terms.wylie" /></td>
                <td><FormattedMessage id="Terms.sanskrit_ru" /></td>
                <td><FormattedMessage id="Terms.sanskrit_en" /></td>
              </tr>
            </thead>
            <tbody data-test-id="terms-list">
            {terms.list.map((elem, i) =>
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{elem['wylie']}</td>
                <td>{elem['sanskrit_ru']}</td>
                <td>{elem['sanskrit_en']}</td>
              </tr>
            )}
            </tbody>
          </table>
        }
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    terms: state.terms
  }
}

export default connect(select)(Terms)
