/*
 * The reducer takes care of state changes in our app through actions
 */

import {
  CHANGE_FORM,
  SET_AUTH,
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR,
  CHANGE_SEARCH_STRING,
  SEARCH_REQUEST_START,
  SEARCH_REQUEST_END
} from '../actions/constants'
import auth from '../auth'

// The initial application state
let initialState = {
  formState: {
    username: '',
    password: ''
  },
  error: '',
  currentlySending: false,
  loggedIn: auth.loggedIn(),
  searchState: {
    searchString: '',
    pending: false,
    result: null,
    error: null
  }
}

// Takes care of changing the application state
function reducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_FORM:
      return {...state, formState: action.newFormState}
    case SET_AUTH:
      return {...state, loggedIn: action.newAuthState}
    case SENDING_REQUEST:
      return {...state, currentlySending: action.sending}
    case REQUEST_ERROR:
      return {...state, error: action.error}
    case CLEAR_ERROR:
      return {...state, error: ''}
    case CHANGE_SEARCH_STRING:
      return {...state, searchState: { ...state.searchState, searchString: action.newSearchString }}
    case SEARCH_REQUEST_START:
      return {...state, searchState: { ...state.searchState, pending: true }}
    case SEARCH_REQUEST_END:
      return {...state, searchState: { ...state.searchState, pending: false, result: action.result, error: action.error }}
    default:
      return state
  }
}

export default reducer
