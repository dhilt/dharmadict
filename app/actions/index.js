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
  SELECT_TERM,
  TOGGLE_COMMENT
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

export function doLoginAsync() {
  return (dispatch, getState) => {
    let authState = getState().auth
    let promise = asyncRequest('login', {
      login: authState.login,
      password: authState.password
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

export function doSearchRequestAsync() {
  return (dispatch, getState) => {
    let searchString = getState().searchState.searchString
    dispatch({
      type: SEARCH_REQUEST_START
    })
    console.log('Let\'s start an async request to db! searchString is "' + searchString + '"')
    return asyncRequest(`search?pattern=${searchString}`, null, (data, error) =>
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

export function toggleComment(translationIndex, meaningIndex) {
  return {
    type: TOGGLE_COMMENT,
    translationIndex,
    meaningIndex
  }
}
