import asyncRequest from '../helpers/remote'
import notifier from '../helpers/notifier'
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
    return asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_COMMON_DATA_END,
        translators: error ? [] : data.translators,
        languages: error ? [] : data.languages
      })
      error && dispatch(notifier.onErrorResponse('App.get_languages_error'))
    })
  }
}

export function changeUserLanguage(language) {
  language = lang.get(language)
  lang.setUserLanguage(language)
  return {
    type: SET_LANGUAGE,
    language
  }
}
