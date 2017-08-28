import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Nav from './common/Nav'

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
  location: PropTypes.object,
  children: PropTypes.object,
  dispatch: PropTypes.func
}

export default App
