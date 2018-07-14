import asyncRequest from '../../helpers/remote'
import notifier from '../../helpers/notifier'

import {
  GET_ALL_USERS_START,
  GET_ALL_USERS_END
} from '../_constants'

export function getAllUsersAsync() {
  return (dispatch) => {
    const query = 'users/all'
    dispatch({
      type: GET_ALL_USERS_START
    })
    return asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_ALL_USERS_END,
        payload: error ? [] : data.users,
        error
      })
      error && dispatch(notifier.onErrorResponse(error))
    })
  }
}
