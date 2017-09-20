import asyncRequest from '../helpers/remote'

import {
  GET_COMMON_DATA_START,
  GET_COMMON_DATA_END
} from './_constants'

export function getCommonDataAsync() {
  return (dispatch) => {
    dispatch({
      type: GET_COMMON_DATA_START
    })
    const query = '/common'
    asyncRequest(query, false, (data, error) =>
      dispatch({
        type: GET_COMMON_DATA_END,
        translators: data.translators,
        languages: data.languages
      })
    )
  }
}
