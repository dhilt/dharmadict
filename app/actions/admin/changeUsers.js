import asyncRequest from '../../helpers/remote'

import {
  CHANGE_USER_DATA_START,
  CHANGE_USER_DATA_END,
  WRITE_USER_ID,
  WRITE_USER_DESCRIPTION
} from '../_constants'

export function changeUserDataAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_USER_DATA_START
    })
    const userId = getState().admin.changeUserData.id
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

export function writeUserId(userId) {
  return {
    type: WRITE_USER_ID,
    id: userId
  }
}

export function writeUserDescription(desc) {
  return {
    type: WRITE_USER_DESCRIPTION,
    description: desc
  }
}
