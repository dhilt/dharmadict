import asyncRequest from '../../helpers/remote'

import {
  CHANGE_USER_DATA_START,
  CHANGE_USER_DATA_END,
  WRITE_USER_DESCRIPTION
} from '../_constants'

export function changeUserDataAsync(userId) {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_USER_DATA_START
    })
    userId = userId.toUpperCase();  // а всегда ли id - это login, написанный заглавными буквами?
    const payload = {
      description: getState().admin.changeUserData.description
    }
    return asyncRequest('updateUser', {userId, payload}, (data, error) =>
      dispatch({
        type: CHANGE_USER_DATA_END,
        result: data,
        error: error
      }))
  }
}

export function writeUserDescription(desc) {
  return {
    type: WRITE_USER_DESCRIPTION,
    description: desc
  }
}
