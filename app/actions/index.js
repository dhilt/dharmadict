import fetch from 'isomorphic-fetch'

/*
 * Actions describe changes of state in your application
 */

// We import constants to name our actions' type
import {
  OPEN_LOGIN_MODAL,
  CLOSE_LOGIN_MODAL,
  CHANGE_LOGIN_STRING,
  CHANGE_PASSWORD_STRING,
  LOGIN_REQUEST_START,
  LOGIN_REQUEST_END,
  CHANGE_FORM,
  SET_AUTH,
  SENDING_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT,
  REQUEST_ERROR,
  CLEAR_ERROR,
  CHANGE_SEARCH_STRING,
  SEARCH_REQUEST_START,
  SEARCH_REQUEST_END
} from './constants'

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

let myFetch = (url, payload) => payload ? fetch(url, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}) : fetch('api/' + path)

let asyncRequest = (path, payload, cb) =>
  myFetch('api/' + path, payload)
    .then(response => {
      if(!response.ok) {
        throw({ message: response.statusText + ' (' + response.status + ')' })
      }
      return response.json()
    })
    .then(json => cb(json.error ? null : json, json.error ? json : null))
    .catch(error => cb(null, error))

export function doLogin (login, password) {
  return (dispatch) =>  {
    dispatch({type: LOGIN_REQUEST_START})
    return asyncRequest('login', { login: login, password: password }, (data, error) =>
      dispatch({type: LOGIN_REQUEST_END, result: data, error: error}))
    }
}

/**
 * Sets the form state
 * @param  {object} newFormState          The new state of the form
 * @param  {string} newFormState.username The new text of the username input field of the form
 * @param  {string} newFormState.password The new text of the password input field of the form
 */
export function changeForm (newFormState) {
  return {type: CHANGE_FORM, newFormState}
}

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export function setAuthState (newAuthState) {
  return {type: SET_AUTH, newAuthState}
}

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function sendingRequest (sending) {
  return {type: SENDING_REQUEST, sending}
}

/**
 * Tells the app we want to log in a user
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.username The username of the user to log in
 * @param  {string} data.password The password of the user to log in
 */
export function loginRequest (data) {
  return {type: LOGIN_REQUEST, data}
}

/**
 * Tells the app we want to log out a user
 */
export function logout () {
  return {type: LOGOUT}
}

/**
 * Tells the app we want to register a user
 * @param  {object} data          The data we're sending for registration
 * @param  {string} data.username The username of the user to register
 * @param  {string} data.password The password of the user to register
 */
export function registerRequest (data) {
  return {type: REGISTER_REQUEST, data}
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function requestError (error) {
  return {type: REQUEST_ERROR, error}
}

/**
 * Sets the `error` state as empty
 */
export function clearError () {
  return {type: CLEAR_ERROR}
}

/**
 * Sets search string within the search state
 * @param  {string} searchString  New text of the search input
 */
export function changeSearchString (newSearchString) {
 return {type: CHANGE_SEARCH_STRING, newSearchString}
}

export function searchRequestStart () {
  return {type: SEARCH_REQUEST_START}
}

export function searchRequestEnd (searchString, result, error) {
  return {type: SEARCH_REQUEST_END, result: result, error: error}
}

export function doSearchRequest (searchString) {
  return dispatch =>  {
    dispatch(searchRequestStart())
    return fetch(`api/search?pattern=${searchString}`)
      .then(response => response.json())
      .then(json => dispatch(searchRequestEnd(searchString, json, null)))
      .catch(error => {
        dispatch(searchRequestEnd(searchString, null, error))
      })
  }
}
