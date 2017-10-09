import asyncRequest from '../helpers/remote'
import lang from '../helpers/lang'
import {notifyOnErrorResponse} from './notifier'

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
    asyncRequest(query, 'get', false, (data, error) => {
      dispatch({
        type: GET_COMMON_DATA_END,
        translators: data.translators,
        languages: data.languages
      })
      error && notifyOnErrorResponse(dispatch, 'App.get_languages_error')
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
