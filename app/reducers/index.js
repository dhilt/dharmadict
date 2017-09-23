import {
  CHANGE_ROUTE,
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
  TRANSLATION_REQUEST_START,
  TRANSLATION_REQUEST_END,
  CHANGE_TRANSLATION_LOCAL,
  TRANSLATION_UPDATE_START,
  TRANSLATION_UPDATE_END,
  CHANGE_NEW_TERM_WYLIE,
  UPDATE_SANSKRIT,
  ADD_TERM_START,
  ADD_TERM_END,
  GET_COMMON_DATA_START,
  GET_COMMON_DATA_END,
  GET_TRANSLATOR_INFO_START,
  GET_TRANSLATOR_INFO_END,
  GET_ADMIN_USER_DATA_START,
  GET_ADMIN_USER_DATA_END,
  CHANGE_ADMIN_USER_DATA_START,
  CHANGE_ADMIN_USER_DATA_END,
  UPDATE_ADMIN_USER_DATA
} from '../actions/_constants'

import initialState from './_initial'

function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_COMMON_DATA_START:
      return {...state,
        common: {...state.common,
          translators: null
        }
      }
    case GET_COMMON_DATA_END:
      return {...state,
        common: {...state.common,
          translators: action.translators,
          languages: action.languages
        }
      }
    case CHANGE_ROUTE:
      return {...state,
        route: {...state.route,
          prevLocation: state.route.location,
          location: action.location
        }
      }
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
          loggedIn: action.loggedIn,
          userInfo: {...state.auth.userInfo,
            pending: false,
            promise: action.promise,
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
          loggedIn: action.loggedIn,
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
        search: {...state.search,
          searchString: action.newSearchString
        }
      }
    case SEARCH_REQUEST_START:
      return {...state,
        search: {...state.search,
          pending: true,
          error: null
        }
      }
    case SEARCH_REQUEST_END:
      return {...state,
        search: {...state.search,
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
      return {...state,
        selected: {...state.selected,
          term: action.term
        }
      }
    case TRANSLATION_REQUEST_START:
      return {...state,
        edit: {...state.edit,
          pending: true,
          error: null
        }
      }
    case TRANSLATION_REQUEST_END:
      return {...state,
        edit: {...state.edit,
          started: true,
          pending: false,
          change: null,
          termId: action.termId,
          termName: action.termName,
          source: action.translation,
          change: action.translationCopy,
          error: action.error
        }
      }
    case CHANGE_TRANSLATION_LOCAL:
      return {...state,
        edit: {...state.edit,
          change: action.change
        }
      }
    case TRANSLATION_UPDATE_START:
      return {...state,
        edit: {...state.edit,
          update: {
            pending: true
          }
        }
      }
    case TRANSLATION_UPDATE_END:
      return {...state,
        search: {...state.search,
          result: action.searchResult
        },
        selected: {...state.selected,
          term: action.term
        },
        edit: {...state.edit,
          update: {
            pending: false,
            error: action.error
          }
        }
      }
    case CHANGE_NEW_TERM_WYLIE:
      return {...state,
        admin: {...state.admin,
          newTerm: {...state.admin.newTerm,
            wylie: action.newWylieString
          }
        }
      }
    case UPDATE_SANSKRIT:
      return {...state,
        admin: {...state.admin,
          newTerm: {...state.admin.newTerm,
            sanskrit: action.payload
          }
        }
      }
    case ADD_TERM_START:
      return {...state,
        admin: {...state.admin,
          newTerm: {...state.admin.newTerm,
            pending: true,
            termId: null
          }
        }
      }
    case ADD_TERM_END:
      return {...state,
        admin: {...state.admin,
          newTerm: {...state.admin.newTerm,
            pending: false,
            termId: !action.error ? action.termId : null,
            error: action.error
          }
        }
      }
    case GET_TRANSLATOR_INFO_START:
      return {...state,
        translatorInfo: {...state.translatorInfo,
          pending: true
        }
      }
    case GET_TRANSLATOR_INFO_END:
      return {...state,
        translatorInfo: {...state.translatorInfo,
          pending: false,
          error: action.error,
          data: action.result
        }
      }
    case GET_ADMIN_USER_DATA_START:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            pending: true,
            error: null
          }
        }
      }
    case GET_ADMIN_USER_DATA_END:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            id: action.id,
            pending: false,
            error: action.error,
            data: action.data,
            dataSource: action.data
          }
        }
      }
    case CHANGE_ADMIN_USER_DATA_START:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            pending: true,
            error: null
          }
        }
      }
    case CHANGE_ADMIN_USER_DATA_END:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            pending: false,
            error: action.error,
            dataSource: action.data
          }
        }
      }
    case UPDATE_ADMIN_USER_DATA:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            data: action.payload
          }
        }
      }
    default:
      return state
  }
}

export default reducer
