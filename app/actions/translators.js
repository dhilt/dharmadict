import asyncRequest from '../helpers/remote'
import notifier from '../helpers/notifier'

import {
  GET_TRANSLATOR_INFO_START,
  GET_TRANSLATOR_INFO_END
} from './_constants'

export function getTranslatorInfoAsync(userId) {
  return (dispatch) => {
    const query = 'users/' + userId
    dispatch({
      type: GET_TRANSLATOR_INFO_START
    })
    return asyncRequest(query, 'get', false, (data, error) => {
      if (!error && data.user.role !== 'translator') {
        error = true
      }
      dispatch({
        type: GET_TRANSLATOR_INFO_END,
        translator: !error ? data.user : null,
        pages: error ? [] : data.pages.filter(p => p.url !== userId),
        error
      })
      error && dispatch(notifier.onErrorResponse('TranslatorPage.request_error'))
    })
  }
}
