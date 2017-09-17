import asyncRequest from '../../helpers/remote'

import {
  CHANGE_USER_DATA_START,
  CHANGE_USER_DATA_END,
  WRITE_USER_ID,
  WRITE_USER_NAME,
  WRITE_USER_LANGUAGE,
  WRITE_USER_DESCRIPTION,
  GET_TRANSLATOR_INFO_FOR_EDIT_START,
  GET_TRANSLATOR_INFO_FOR_EDIT_END
} from '../_constants'

export function getTranslatorInfoAsync(userId) {
  return (dispatch) => {
    const query = 'users/' + userId
    dispatch({
      type: GET_TRANSLATOR_INFO_FOR_EDIT_START
    })
    asyncRequest(query, false, (data, error) =>
      dispatch({
        type: GET_TRANSLATOR_INFO_FOR_EDIT_END,
        error: error,
        result: !error ? data.user : null
      })
    )
  }
}

export function changeUserDataAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_USER_DATA_START
    })
    const userId = getState().admin.changeUserData.id
    const payload = {
      name: getState().admin.changeUserData.name,
      language: getState().admin.changeUserData.language,
      description: getState().admin.changeUserData.description
    }
    return asyncRequest('updateUser', {userId, payload}, (data, error) =>
      dispatch({
        type: CHANGE_USER_DATA_END,
        result: data,
        error: error
      }))
  }
}

export function writeUserId (id) {
  return {
    type: WRITE_USER_ID,
    id
  }
}

export function writeUserName(name) {
  return {
    type: WRITE_USER_NAME,
    name
  }
}

export function writeUserLanguage(language) {
  return {
    type: WRITE_USER_LANGUAGE,
    language
  }
}

export function writeUserDescription(description) {
  return {
    type: WRITE_USER_DESCRIPTION,
    description
  }
}
