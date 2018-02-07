import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Notifier from './common/Notifier'
import Header from './common/Header'

class App extends Component {
  render () {
    return (
      <div data-test-id="App" className="wrapper">
        <Notifier />
        <Header />
        <div className="container">
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
