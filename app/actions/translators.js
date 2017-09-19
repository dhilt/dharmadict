import asyncRequest from '../helpers/remote'

import {
  GET_ALL_TRANSLATORS_START,
  GET_ALL_TRANSLATORS_END,
  GET_TRANSLATOR_INFO_START,
  GET_TRANSLATOR_INFO_END
} from './_constants'

export function getCommonDataAsync() {
  return (dispatch) => {
    dispatch({
      type: GET_ALL_TRANSLATORS_START
    })
    const query = '/common'
    asyncRequest(query, false, (data, error) =>
      dispatch({
        type: GET_ALL_TRANSLATORS_END,
        payload: data.translators
      })
    )
  }
}

export function getTranslatorInfoAsync(userId) {
  return (dispatch) => {
    const query = 'users/' + userId
    dispatch({
      type: GET_TRANSLATOR_INFO_START
    })
    asyncRequest(query, false, (data, error) =>
      dispatch({
        type: GET_TRANSLATOR_INFO_END,
        error: error,
        result: !error ? data.user : null
      })
    )
  }
}
