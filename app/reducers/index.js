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
  TOGGLE_COMMENT,
  TERM_REQUEST_START,
  TERM_REQUEST_END
} from '../actions/constants'

import auth from '../helpers/auth'

let initialState = {
  auth: {
    loggedIn: false,
    token: null,
    userInfo: {
      requested: false,
      pending: false,
      promise: null,
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
    started: false,
    pending: false,
    result: null,
    error: null
  },
  selected: {
    term: null
  },
  edit: {
    termSource: null,
    termChange: null,
    pending: false,
    error: null
  }
}

auth.initialize(initialState.auth)

function reducer(state = initialState, action) {
  switch (action.type) {
    case USERINFO_REQUEST_START:
      return {...state,
        auth: {...state.auth,
          userInfo: {...state.auth.userInfo,
            requested: true,
            pending: true,
            promise: action.promise,
            error: null
          }
        }
      }
    case USERINFO_REQUEST_END:
      return {...state,
        auth: {...state.auth,
          loggedIn: !action.error,
          userInfo: {...state.auth.userInfo,
            pending: false,
            promise: !action.error ? state.auth.userInfo.promise : null,
            data: action.result,
            error: action.error
          }
        }
      }
    case OPEN_LOGIN_MODAL:
      return {...state,
        auth: {...state.auth,
          modalIsOpen: true
        }
      }
    case CLOSE_LOGIN_MODAL:
      return {...state,
        auth: {...state.auth,
          modalIsOpen: false,
          password: '',
          error: null
        }
      }
    case CHANGE_LOGIN_STRING:
      return {...state,
        auth: {...state.auth,
          login: action.login
        }
      }
    case CHANGE_PASSWORD_STRING:
      return {...state,
        auth: {...state.auth,
          password: action.password
        }
      }
    case LOGIN_REQUEST_START:
      return {...state,
        auth: {...state.auth,
          pending: true,
          error: null
        }
      }
    case LOGIN_REQUEST_END:
      return {...state,
        auth: {...state.auth,
          pending: false,
          token: action.token,
          error: action.error,
          loggedIn: !action.error,
          password: ''
        }
      }
    case LOGOUT:
      return {...state,
        auth: {...initialState.auth
        }
      }
    case CHANGE_SEARCH_STRING:
      return {...state,
        searchState: {...state.searchState,
          searchString: action.newSearchString
        }
      }
    case SEARCH_REQUEST_START:
      return {...state,
        searchState: {...state.searchState,
          pending: true,
          error: null
        }
      }
    case SEARCH_REQUEST_END:
      return {...state,
        searchState: {...state.searchState,
          started: true,
          pending: false,
          result: action.result,
          error: action.error
        },
        selected: {...state.selected,
          term: null
        }
      }
    case SELECT_TERM:
      return {...state,
        selected: {...state.selected,
          term: action.term
        }
      }
    case TOGGLE_COMMENT:
      let term = state.selected.term
      let meaning = term.translations[action.translationIndex].meanings[action.meaningIndex]
      meaning.openComment = !meaning.openComment
      return {...state,
        selected: {...state.selected,
          term: term
        }
      }
    case TERM_REQUEST_START:
      return {...state,
        edit: {...state.edit,
          pending: true,
          error: null
        }
      }
    case TERM_REQUEST_END:
      return {...state,
        edit: {...state.edit,
          pending: false,
          termSource: action.result,
          error: action.error
        }
      }
    default:
      return state
  }
}

export default reducer
