import React, {Component} from 'react'
import {connect} from 'react-redux'
import SearchInput from './search/SearchInput'
import SearchResults from './search/SearchResults'

import logoPath from '../styles/images/manjushri_175x226.jpg'

class Home extends Component {
  render () {
    return (
      <div className="row">
        <div className="col-md-2">
          <img src={logoPath} className="logo" />
        </div>
        <div className="col-md-10">
          <div className="row header-row">
              <div className="col-md-12">
                <h1><em>Буддийская терминология</em> в русских переводах</h1>
              </div>
          </div>
          <div className="row search-row" >
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

function select (state) {
  return {
    data: state
  }
}

export default connect(select)(Home)
