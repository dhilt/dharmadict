import React, {Component} from 'react'
import {connect} from 'react-redux'
import Search from './search/Search'

class Home extends Component {
  render () {
    return (
      <article>
        <div>
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
