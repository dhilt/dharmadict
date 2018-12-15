import asyncRequest from '../helpers/remote'
import notifier from '../helpers/notifier'

import {
  GET_ALL_TERMS_START,
  GET_ALL_TERMS_END
} from './_constants'

export function getAllTermsAsync() {
  return (dispatch) => {
    dispatch({ type: GET_ALL_TERMS_START })
    return asyncRequest('terms/all', 'get', false, (data, error) => {
      dispatch({
        type: GET_ALL_TERMS_END,
        terms: error ? [] : data.terms
      })
      error && dispatch(notifier.onErrorResponse('App.get_terms_error'))
    })
  }
}
