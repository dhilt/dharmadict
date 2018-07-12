import asyncRequest from '../helpers/remote'
import notifier from '../helpers/notifier'

import {
  GET_TRANSLATOR_INFO_START,
  GET_TRANSLATOR_INFO_END,
  GET_TRANSLATOR_PAGES_START,
  GET_TRANSLATOR_PAGES_END
} from './_constants'

export function getTranslatorInfoAsync(userId) {
  return (dispatch) => {
    const query = 'users/' + userId
    dispatch({
      type: GET_TRANSLATOR_INFO_START
    })
    return asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_TRANSLATOR_INFO_END,
        result: !error ? data.user : null,
        error
      })
      error && dispatch(notifier.onErrorResponse('TranslatorPage.request_error'))
    })
  }
}

export function getPagesByTranslator(userId) {
  return (dispatch) => {
    dispatch({
      type: GET_TRANSLATOR_PAGES_START
    })
    const query = `pagesByAuthor?authorId=${userId}`
    return asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_TRANSLATOR_PAGES_END,
        payload: error ? [] : data,
        error
      })
      error && dispatch(notifier.onErrorResponse('TranslatorPage.request_error'))
    })
  }
}
