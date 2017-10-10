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
    asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_TRANSLATOR_INFO_END,
        error: error,
        result: !error ? data.user : null
      })
      error && dispatch(notifier.onErrorResponse('TranslatorPage.request_error'))
    })
  }
}
