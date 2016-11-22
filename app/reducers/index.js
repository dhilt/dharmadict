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
} from '../actions/constants'

import auth from '../auth'

let initialState = {
  auth: {
    loggedIn: false,
    userInfo: {
      requested: false,
      pending: false,
      data: null,
      error: null
    },
    modalIsOpen: false,
    login: '',
    password: '',
    pending: false,
    error: null
  },
  searchState: {
    searchString: '',
    pending: false,
    result: null,
    error: null
  }
}

function reducer (state = initialState, action) {
  switch (action.type) {
    case USERINFO_REQUEST_START:
      return {...state, auth: { ...state.auth, userInfo: { ...state.auth.userInfo, requested: true, pending: true, error: null }}}
    case USERINFO_REQUEST_END:
      return {...state, auth: { ...state.auth, loggedIn: !action.error, userInfo: { ...state.auth.userInfo, pending: false, data: action.result, error: action.error }}}

    case OPEN_LOGIN_MODAL:
      return {...state, auth: { ...state.auth, modalIsOpen: true }}
    case CLOSE_LOGIN_MODAL:
      return {...state, auth: { ...state.auth, modalIsOpen: false, password: '', error: null }}
    case CHANGE_LOGIN_STRING:
      return {...state, auth: { ...state.auth, login: action.login }}
    case CHANGE_PASSWORD_STRING:
      return {...state, auth: { ...state.auth, password: action.password }}
    case LOGIN_REQUEST_START:
      return {...state, auth: { ...state.auth, pending: true, error: null }}
    case LOGIN_REQUEST_END:
      return {...state, auth: { ...state.auth, pending: false, error: action.error, loggedIn: !action.error, userInfo: { ...state.auth.userInfo, data: action.result }}}

    case CHANGE_SEARCH_STRING:
      return {...state, searchState: { ...state.searchState, searchString: action.newSearchString }}
    case SEARCH_REQUEST_START:
      return {...state, searchState: { ...state.searchState, pending: true, error: null }}
    case SEARCH_REQUEST_END:
      return {...state, searchState: { ...state.searchState, pending: false, result: action.result, error: action.error }}
    default:
      return state
  }
}

export default reducer
