import asyncRequest from '../helpers/remote'

import {
  GET_TRANSLATOR_INFO_START,
  GET_TRANSLATOR_INFO_END
} from './_constants'

export function getTranslatorInfoAsync(name) {
  return (dispatch) => {
    const query = 'user/' + name
    dispatch({
      type: GET_TRANSLATOR_INFO_START
    })
    asyncRequest(query, false, (data, error) =>
      dispatch({
        type: GET_TRANSLATOR_INFO_END,
        result: data,
        error: error
      })
    )
  }
}
