import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'

import SearchInput from './search/SearchInput'
import SearchResults from './search/SearchResults'

import logoPath from '../styles/images/manjushri_175x226.jpg'

class Home extends Component {
  render () {
    return (
      <div data-test-id="Home" className="row">
        <div className="col-md-2">
          <img src={logoPath} className="logo" />
        </div>
        <div className="col-md-10">
          <div className="row header-row">
            <div className="col-md-12">
              <h1>
                <em><FormattedMessage id="Home.search_title_em" /></em>
                <span data-test-id="span-title">
                  <FormattedMessage id="Home.search_title_h1" />
                </span>
              </h1>
            </div>
          </div>
          <div className="row search-row">
            <div className="col-md-12">
              <SearchInput />
              <SearchResults />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
