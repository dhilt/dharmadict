import { browserHistory } from 'react-router'
import auth from '../helpers/auth'
import asyncRequest from '../helpers/remote'
import {notifyOnErrorResponse} from './notifier'

import {
  USERINFO_REQUEST_START,
  USERINFO_REQUEST_END,
  OPEN_LOGIN_MODAL,
  CLOSE_LOGIN_MODAL,
  CHANGE_LOGIN_STRING,
  CHANGE_PASSWORD_STRING,
  LOGIN_REQUEST_START,
  LOGIN_REQUEST_END,
  LOGOUT
} from './_constants'

export function getUserInfoAsync() {
  return (dispatch, getState) => {
    const promise = asyncRequest('userInfo', 'get', false, (data, error) => {
      const authState = getState().auth
      dispatch({
        type: USERINFO_REQUEST_END,
        result: data,
        error: error,
        loggedIn: !error
      })
      notifyOnErrorResponse(dispatch, error)
    })
    dispatch({
      type: USERINFO_REQUEST_START,
      promise
    })
    return promise
  }
}

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
    let promise = asyncRequest('login', 'post', {
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
        error: error,
        loggedIn: !error
      })
      dispatch({
        type: USERINFO_REQUEST_END,
        result: data ? data.user : null,
        error: error,
        loggedIn: !error,
        promise: !error ? authState.userInfo.promise : null
      })
      if (error) {
        notifyOnErrorResponse(dispatch, 'Login.authorization_error')
      }
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
