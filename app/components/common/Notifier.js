import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Alert, Button} from 'react-bootstrap'

import {removeNotify} from '../../actions/notifier'

class Notifier extends Component {

  constructor(props) {
    super(props)
    this.closeAlert = this.closeAlert.bind(this)
  }

  closeAlert (id) {
    this.props.dispatch(removeNotify(id, true))
  }

  render () {
    const {notifications} = this.props
    return (
      <div className="alert-column">
        {
          notifications.length !== 0 && notifications.map((elem, index) =>
            <Alert key={index} bsStyle={elem.type}>
              {elem.text}
              <Button className="alert-close-button" onClick={() => this.closeAlert(elem.id)}>{'Hide'}</Button>
            </Alert>
          )
        }
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    notifications: state.notifications.list
  }
}

Notifier.propTypes = {
  notifications: PropTypes.array
}

export default connect(select)(Notifier)
