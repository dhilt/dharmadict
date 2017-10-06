import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Header from './common/Header'
import Notifier from './common/Notifier'

class App extends Component {
  render () {
    return (
      <div className='wrapper'>
        <Notifier />
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
