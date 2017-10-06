import asyncRequest from '../../helpers/remote'

import {
  CHANGE_ADMIN_USER_DATA_START,
  CHANGE_ADMIN_USER_DATA_END,
  GET_ADMIN_USER_DATA_START,
  GET_ADMIN_USER_DATA_END,
  UPDATE_ADMIN_USER_DATA,
  GET_ADMIN_USER_PASSWORD_ID,
  CHANGE_ADMIN_USER_PASSWORD_START,
  CHANGE_ADMIN_USER_PASSWORD_END,
  UPDATE_ADMIN_USER_PASSWORD
} from '../_constants'

const getEditableUserDataObject = (user) => ({
  name: user.name,
  language: user.language,
  description: user.description
})

export function getAdminUserDataAsync(userId) {
  return (dispatch, getState) => {
    const query = 'users/' + userId
    dispatch({
      type: GET_ADMIN_USER_DATA_START
    })
    const {id, dataSource} = getState().admin.editUser
    asyncRequest(query, 'get', false, (data, error) =>
      dispatch({
        type: GET_ADMIN_USER_DATA_END,
        error: error ? error : null,
        data: error ? dataSource : getEditableUserDataObject(data.user),
        id: error ? id : data.user.id
      })
    )
  }
}

export function getAdminUserPasswordId(userId) {
  return {
    type: GET_ADMIN_USER_PASSWORD_ID,
    id: userId
  }
}

export function changeAdminUserDataAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_ADMIN_USER_DATA_START
    })
    const {id, data, dataSource} = getState().admin.editUser
    const query = 'users/' + id
    asyncRequest(query, 'patch', {payload: data}, (data, error) =>
      dispatch({
        type: CHANGE_ADMIN_USER_DATA_END,
        error: error ? error : null,
        data: error ? dataSource : getEditableUserDataObject(data.user)
      }))
  }
}

export function changeAdminUserPasswordAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_ADMIN_USER_PASSWORD_START
    })
    const {id, password, confirmPassword} = getState().admin.editUserPassword
    const data = {password, confirmPassword}
    const query = 'users/' + id
    asyncRequest(query, 'patch', {payload: data}, (data, error) =>
      dispatch({
        type: CHANGE_ADMIN_USER_PASSWORD_END,
        error: error ? error : null,
        result: error ? false : true
      })
    )
  }
}

export function updateAdminUserData(_data) {
  return (dispatch, getState) => {
    const {data} = getState().admin.editUser
    const payload = {
      name: _data.hasOwnProperty('name') ? _data.name : data.name,
      language: _data.hasOwnProperty('language') ? _data.language : data.language,
      description: _data.hasOwnProperty('description') ? _data.description : data.description
    }
    dispatch({
      type: UPDATE_ADMIN_USER_DATA,
      payload
    })
  }
}

export function updateAdminUserPassword(_data) {
  return (dispatch, getState) => {
    const {editUserPassword} = getState().admin
    dispatch({
      type: UPDATE_ADMIN_USER_PASSWORD,
      password: _data.hasOwnProperty('password') ? _data.password : editUserPassword.password,
      confirmPassword: _data.hasOwnProperty('confirmPassword') ? _data.confirmPassword : editUserPassword.confirmPassword
    })
  }
}

export function resetAdminUserData() {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_ADMIN_USER_DATA,
      payload: getState().admin.editUser.dataSource
    })
  }
}

export function resetAdminUserPassword() {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_ADMIN_USER_PASSWORD,
      password: '',
      confirmPassword: ''
    })
  }
}
