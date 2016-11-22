import fetch from 'isomorphic-fetch'

import {
  USERINFO_REQUEST_START,
  USERINFO_REQUEST_END,
  OPEN_LOGIN_MODAL,
  CLOSE_LOGIN_MODAL,
  CHANGE_LOGIN_STRING,
  CHANGE_PASSWORD_STRING,
  LOGIN_REQUEST_START,
  LOGIN_REQUEST_END,
  CHANGE_SEARCH_STRING,
  SEARCH_REQUEST_START,
  SEARCH_REQUEST_END
} from './constants'


let asyncRequest = (path, payload, cb) =>
  fetch('api/' + path, payload ? {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    }: undefined)
    .then(response => {
      if(!response.ok) {
        throw({ message: response.statusText + ' (' + response.status + ')' })
      }
      return response.json()
    })
    .then(json => cb(json.error ? null : json, json.error ? json : null))
    .catch(error => cb(null, error))

// userInfo

export function getUserInfoAsync () {
  return (dispatch) =>  {
    dispatch({type: USERINFO_REQUEST_START})
    return asyncRequest('userInfo', false, (data, error) =>
      dispatch({type: USERINFO_REQUEST_END, result: data, error: error}))
    }
}

// login

export function openLoginModal () {
  return {type: OPEN_LOGIN_MODAL}
}

export function closeLoginModal () {
  return {type: CLOSE_LOGIN_MODAL}
}

export function changeLoginString (login) {
  return {type: CHANGE_LOGIN_STRING, login: login}
}

export function changePasswordString (password) {
  return {type: CHANGE_PASSWORD_STRING, password: password}
}

export function doLoginAsync (login, password) {
  return (dispatch) =>  {
    dispatch({type: LOGIN_REQUEST_START})
    return asyncRequest('login', { login: login, password: password }, (data, error) =>
      dispatch({type: LOGIN_REQUEST_END, result: data, error: error}))
    }
}

// search

export function changeSearchString (newSearchString) {
 return {type: CHANGE_SEARCH_STRING, newSearchString}
}

export function doSearchRequestAsync (searchString) {
  return (dispatch) =>  {
    dispatch({type: SEARCH_REQUEST_START})
    return asyncRequest(`search?pattern=${searchString}`, null, (data, error) =>
      dispatch({type: SEARCH_REQUEST_END, result: data, error: error}))
    }
}
