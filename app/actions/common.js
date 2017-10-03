import asyncRequest from '../helpers/remote'
import lang from '../helpers/lang'

import {
  GET_COMMON_DATA_START,
  GET_COMMON_DATA_END,
  SET_LANGUAGE
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
  language = lang.get(language)
  localStorage.setItem('userLanguage', language)
  return {
    type: SET_LANGUAGE,
    language: language
  }
}
