import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Header from './common/Header'

class App extends Component {
  render () {
    return (
      <div className='wrapper'>
        <Header />
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
