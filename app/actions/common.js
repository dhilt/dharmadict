import asyncRequest from '../helpers/remote'

import {
  GET_COMMON_DATA_START,
  GET_COMMON_DATA_END,
  CHANGE_USER_LANGUAGE
} from './_constants'

export function getCommonDataAsync() {
  return (dispatch) => {
    dispatch({
      type: GET_COMMON_DATA_START
    })
    const query = 'common'
    asyncRequest(query, 'get', false, (data, error) =>
      dispatch({
        type: GET_COMMON_DATA_END,
        translators: data.translators,
        languages: data.languages
      })
    )
  }
}

export function changeUserLanguage(language) {
  localStorage.setItem('userLanguage', language.slice(0, 2))
  return {
    type: CHANGE_USER_LANGUAGE,
    language: language.slice(0, 2)
  }
}
