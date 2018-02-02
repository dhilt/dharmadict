import asyncRequest from '../helpers/remote'
import notifier from '../helpers/notifier'

import {
  GET_ALL_PAGES_START,
  GET_ALL_PAGES_END,
  GET_PAGE_START,
  GET_PAGE_END
} from './_constants'

export function getAllPagesAsync() {
  return (dispatch) => {
    dispatch({
      type: GET_ALL_PAGES_START
    })
    const query = 'pages/all'
    return asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_ALL_PAGES_END,
        data: error ? [] : data
      })
      error && dispatch(notifier.onErrorResponse(error))
    })
  }
}

export function getPageAsync(pageUrl) {
  return (dispatch) => {
    dispatch({
      type: GET_PAGE_START
    })
    const query = 'pages?url=' + pageUrl
    return asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_PAGE_END,
        data: error ? null : data
      })
      error && dispatch(notifier.onErrorResponse(error))
    })
  }
}
