import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Header from './common/Header'
import Notifier from './common/Notifier'

class App extends Component {
  render () {
    return (
      <div data-test-id="App" className='wrapper'>
        <Notifier />
        <Header />
        <div data-test-id="App.container" className='container'>
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
