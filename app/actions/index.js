import { browserHistory } from 'react-router'
import auth from '../helpers/auth'
import asyncRequest from '../helpers/remote'

import {
  USERINFO_REQUEST_START,
  USERINFO_REQUEST_END,
  OPEN_LOGIN_MODAL,
  CLOSE_LOGIN_MODAL,
  CHANGE_LOGIN_STRING,
  CHANGE_PASSWORD_STRING,
  LOGIN_REQUEST_START,
  LOGIN_REQUEST_END,
  LOGOUT,
  CHANGE_SEARCH_STRING,
  SEARCH_REQUEST_START,
  SEARCH_REQUEST_END,
  SELECT_TERM
} from './constants'

// userInfo

export function getUserInfoAsync() {
  return (dispatch) => {
    let promise = asyncRequest('userInfo', false, (data, error) =>
      dispatch({
        type: USERINFO_REQUEST_END,
        result: data,
        error: error
      }))
    dispatch({
      type: USERINFO_REQUEST_START,
      promise: promise
    })
    return promise
  }
}

// login

export function openLoginModal() {
  return {
    type: OPEN_LOGIN_MODAL
  }
}

export function closeLoginModal() {
  return {
    type: CLOSE_LOGIN_MODAL
  }
}

export function changeLoginString(login) {
  return {
    type: CHANGE_LOGIN_STRING,
    login: login
  }
}

export function changePasswordString(password) {
  return {
    type: CHANGE_PASSWORD_STRING,
    password: password
  }
}

export function doLoginAsync(login, password) {
  return (dispatch) => {
    let promise = asyncRequest('login', {
      login: login,
      password: password
    }, (data, error) => {
      if (!error && data.token) {
        auth.setToken(data.token)
        dispatch(closeLoginModal())
      }
      dispatch({
        type: LOGIN_REQUEST_END,
        token: data ? data.token : null,
        error: error
      })
      dispatch({
        type: USERINFO_REQUEST_END,
        result: data ? data.user : null,
        error: error
      })
    })

    dispatch({
      type: LOGIN_REQUEST_START
    })
    dispatch({
      type: USERINFO_REQUEST_START,
      promise: promise
    })

    return promise
  }
}

export function doLogout() {
  auth.removeToken()
  browserHistory.push('/')
  return {
    type: LOGOUT
  }
}

// search

export function changeSearchString(newSearchString) {
  return {
    type: CHANGE_SEARCH_STRING,
    newSearchString
  }
}

export function doSearchRequestAsync(searchString) {
  return (dispatch) => {
    dispatch({
      type: SEARCH_REQUEST_START
    })
    return asyncRequest(`search_test?pattern=${searchString}`, null, (data, error) =>
      dispatch({
        type: SEARCH_REQUEST_END,
        result: data,
        error: error
      }))
  }
}

export function selectTerm(term) {
  return {
    type: SELECT_TERM,
    term
  }
}
