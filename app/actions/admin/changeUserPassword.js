import asyncRequest from '../../helpers/remote'
import notifier from '../../helpers/notifier'

import {
  SET_ADMIN_USER_ID,
  UPDATE_ADMIN_USER_PASSWORD_START,
  UPDATE_ADMIN_USER_PASSWORD_END,
  CHANGE_ADMIN_USER_PASSWORD
} from '../_constants'

export function setUserId(userId) {
  return {
    type: SET_ADMIN_USER_ID,
    id: userId
  }
}

export function updateAdminUserPasswordAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_ADMIN_USER_PASSWORD_START
    })
    const {id, password, confirmPassword} = getState().admin.editUserPassword
    const data = {password, confirmPassword}
    const query = 'users/' + id
    return asyncRequest(query, 'patch', {payload: data}, (data, error) => {
      dispatch({
        type: UPDATE_ADMIN_USER_PASSWORD_END,
        error: error ? error : null,
        result: error ? false : true
      })
      dispatch(notifier.onResponse('EditUserPassword.new_password_success', error))
    })
  }
}

export function changeAdminUserPassword(_data) {
  return (dispatch, getState) => {
    const {editUserPassword} = getState().admin
    dispatch({
      type: CHANGE_ADMIN_USER_PASSWORD,
      password: _data.hasOwnProperty('password') ? _data.password : editUserPassword.password,
      confirmPassword: _data.hasOwnProperty('confirmPassword') ? _data.confirmPassword : editUserPassword.confirmPassword
    })
  }
}

export function resetAdminUserPassword() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_ADMIN_USER_PASSWORD,
      password: '',
      confirmPassword: ''
    })
  }
}
