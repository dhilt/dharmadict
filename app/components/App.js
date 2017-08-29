import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Nav from './common/header/Nav'

class App extends Component {
  render () {
    return (
      <div className='wrapper'>
        <Nav />
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object
}

export default App
