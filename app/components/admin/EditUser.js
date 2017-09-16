import React, {Component} from 'react'
import {connect} from 'react-redux'

import { changeUserDataAsync, writeUserDescription } from '../../actions/admin/changeUsers'

class EditUser extends Component {

  constructor(props) {
    super(props)
    this.sendNewUserData = this.sendNewUserData.bind(this)
    this.changeUserDescription = this.changeUserDescription.bind(this)
  }

  changeUserDescription (event) {
    this.props.dispatch(writeUserDescription(event.target.value))
  }

  sendNewUserData (event) {
    event.preventDefault()
    const userId = this.props.params.login
    this.props.dispatch(changeUserDataAsync(userId))
  }

  render () {
    const { error, result } = this.props.data
    console.log('!!', this.props)
    return (
      <div className='wrapper'>
        <h3>{'Admin page'}</h3>
        <div className='container'>
          <form className='thumbnail col-md-4'>
            <h3>{'Change user description'}</h3>
            <div className="form-group">
              <label>{'Enter description'}</label>
              <input type="text" className="form-control" placeholder="User description" onChange={this.changeUserDescription} />
            </div>
            <button className="btn btn-primary" onClick={this.sendNewUserData}>{'Change'}</button>
            {error && <div className='alert alert-danger'>{error.message}</div>}
            {!error && result && <div className='alert alert-success'>{'success'}</div>}
          </form>
        </div>
      </div>
    )
  }
}

function select (state, ownProps) {
  return {
    data: state.admin.changeUserData
  }
}

export default connect(select)(EditUser)
