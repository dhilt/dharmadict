import React, {Component} from 'react'
import {connect} from 'react-redux'
import Search from './Search'

import logoPath from '../styles/images/manjushri.jpg'

class Home extends Component {
  render () {
    return (
      <article>
        <div>
          <section className="logo">
            <img src={logoPath}/>
          </section>
          <section className='text-section'>
            <h1>Welcome to Dharmadict!</h1>
            <Search/>
          </section>
        </div>
      </article>
    )
  }
}

function select (state) {
  return {
    data: state
  }
}

export default connect(select)(Home)
