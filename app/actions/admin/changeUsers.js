import asyncRequest from '../../helpers/remote'

import {
  CHANGE_USER_DATA_START,
  CHANGE_USER_DATA_END,
  UPDATE_USER_DATA,
  GET_ADMIN_USER_DATA_START,
  GET_ADMIN_USER_DATA_END,
  RESET_ADMIN_USER_DATA_NAME,
  RESET_ADMIN_USER_DATA_LANGUAGE,
  RESET_ADMIN_USER_DATA_DESCRIPTION
} from '../_constants'

export function getAdminUserDataAsync(userId) {
  return (dispatch) => {
    const query = 'users/' + userId
    dispatch({
      type: GET_ADMIN_USER_DATA_START
    })
    asyncRequest(query, false, (data, error) =>
      dispatch({
        type: GET_ADMIN_USER_DATA_END,
        error: error ? error : null,
        result: !error ? data.user : null
      })
    )
  }
}

export function changeUserDataAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_USER_DATA_START
    })
    const userId = getState().admin.editUser.id
    const payload = {
      name: getState().admin.editUser.data.name,
      language: getState().admin.editUser.data.language,
      description: getState().admin.editUser.data.description
    }
    return asyncRequest('updateUser', {userId, payload}, (data, error) =>
      dispatch({
        type: CHANGE_USER_DATA_END,
        result: !error ? data : null,
        error: error ? error : null
      }))
  }
}

export function updateUserData(dataObject) {
  return {
    type: UPDATE_USER_DATA,
    name: dataObject.name,
    language: dataObject.language,
    description: dataObject.description
  }
}

export function resetAdminUserData() {
  return (dispatch, getState) => {
    dispatch({
      type: RESET_ADMIN_USER_DATA_NAME,
      name: getState().admin.editUser.dataSource.name
    })
    dispatch({
      type: RESET_ADMIN_USER_DATA_LANGUAGE,
      language: getState().admin.editUser.dataSource.language
    })
    dispatch({
      type: RESET_ADMIN_USER_DATA_DESCRIPTION,
      description: getState().admin.editUser.dataSource.description
    })
  }
}
