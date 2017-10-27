import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'

import SearchInput from './search/SearchInput'
import SearchResults from './search/SearchResults'

import logoPath from '../styles/images/manjushri_175x226.jpg'

class Home extends Component {
  render () {
    return (
      <div data-test-id="main-div" className="row">
        <div data-test-id="div-logo" className="col-md-2">
          <img data-test-id="img-logo" src={logoPath} className="logo" />
        </div>
        <div data-test-id="title-md-10" className="col-md-10">
          <div data-test-id="header-row" className="row header-row">
            <div data-test-id="title-md-12" className="col-md-12">
              <h1 data-test-id="full-title">
                <em data-test-id="em-title"><FormattedMessage id="Home.search_title_em" /></em>
                <span data-test-id="span-title"><FormattedMessage id="Home.search_title_h1" /></span>
              </h1>
            </div>
          </div>
          <div data-test-id="search-row" className="row search-row">
            <div data-test-id="search-md-12" className="col-md-12">
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
