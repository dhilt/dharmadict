import {
  CHANGE_ROUTE,
  USERINFO_REQUEST_START,
  USERINFO_REQUEST_END,
  CREATE_NOTIFICATION,
  REMOVE_NOTIFICATION,
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
  CHANGE_NEW_TERM_SANSKRIT,
  ADD_TERM_START,
  ADD_TERM_END,
  GET_ALL_PAGES_START,
  GET_ALL_PAGES_END,
  GET_PAGE_START,
  GET_PAGE_END,
  CHANGE_PAGE_DATA,
  GET_PAGE_FOR_EDIT_START,
  GET_PAGE_FOR_EDIT_END,
  UPDATE_PAGE_START,
  UPDATE_PAGE_END,
  DELETE_PAGE_START,
  DELETE_PAGE_END,
  CREATE_PAGE_START,
  CREATE_PAGE_END,
  CHANGE_NEW_PAGE_DATA,
  GET_COMMON_DATA_START,
  GET_COMMON_DATA_END,
  SET_LANGUAGE,
  GET_TRANSLATOR_INFO_START,
  GET_TRANSLATOR_INFO_END,
  GET_ADMIN_USER_DATA_START,
  GET_ADMIN_USER_DATA_END,
  UPDATE_ADMIN_USER_DATA_START,
  UPDATE_ADMIN_USER_DATA_END,
  CHANGE_ADMIN_USER_DATA,
  SET_ADMIN_USER_ID,
  UPDATE_ADMIN_USER_PASSWORD_START,
  UPDATE_ADMIN_USER_PASSWORD_END,
  CHANGE_ADMIN_USER_PASSWORD,
  UPDATE_TRANSLATOR_PASSWORD_START,
  UPDATE_TRANSLATOR_PASSWORD_END,
  CHANGE_TRANSLATOR_PASSWORD
} from '../actions/_constants'

import initialState from './_initial'

function reducer(state = initialState, action = {}) {
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
    case GET_ALL_PAGES_START:
      return {...state,
        pages: {...state.pages,
          pending: true
        }
      }
    case GET_ALL_PAGES_END:
      return {...state,
        pages: {...state.pages,
          pending: false,
          list: action.data
        }
      }
    case GET_PAGE_START:
      return {...state,
        pages: {...state.pages,
          current: {...state.pages.current,
            pending: true
          }
        }
      }
    case GET_PAGE_END:
      return {...state,
        pages: {...state.pages,
          current: {...state.pages.current,
            page: action.data,
            pending: false
          }
        }
      }
    case CHANGE_PAGE_DATA:
      return {...state,
        admin: {...state.admin,
          editPage: {...state.admin.editPage,
            data: action.payload
          }
        }
      }
    case GET_PAGE_FOR_EDIT_START:
      return {...state,
        admin: {...state.admin,
          editPage: {...state.admin.editPage,
            sourcePending: true
          }
        }
      }
    case GET_PAGE_FOR_EDIT_END:
      return {...state,
        admin: {...state.admin,
          editPage: {...state.admin.editPage,
            noPermission: action.noPermission,
            sourcePending: false,
            dataSource: action.data,
            data: action.data,
            url: action.url
          }
        }
      }
    case UPDATE_PAGE_START:
      return {...state,
        admin: {...state.admin,
          editPage: {...state.admin.editPage,
            pending: true
          }
        }
      }
    case UPDATE_PAGE_END:
      return {...state,
        admin: {...state.admin,
          editPage: {...state.admin.editPage,
            dataSource: action.dataSource,
            data: action.data,
            pending: false
          }
        }
      }
    case DELETE_PAGE_START:
      return {...state,
        admin: {...state.admin,
          editPage: {...state.admin.editPage,
            removePending: true
          }
        }
      }
    case DELETE_PAGE_END:
      return {...state,
        admin: {...state.admin,
          editPage: {...state.admin.editPage,
            removePending: false
          }
        }
      }
    case CHANGE_NEW_PAGE_DATA:
      return {...state,
        admin: {...state.admin,
          newPage: {...state.admin.newPage,
            data: action.payload
          }
        }
      }
    case CREATE_PAGE_START:
      return {...state,
        admin: {...state.admin,
          newPage: {...state.admin.newPage,
            pending: true
          }
        }
      }
    case CREATE_PAGE_END:
      return {...state,
        admin: {...state.admin,
          newPage: {...state.admin.newPage,
            pending: false
          }
        }
      }
    case CREATE_NOTIFICATION:
      return {...state,
        notifications: {...state.notifications,
          idLast: action.idLast,
          list: [...state.notifications.list, action.notification]
        }
      }
    case REMOVE_NOTIFICATION:
      return {...state,
        notifications: {...state.notifications,
          list: action.notifications
        }
      }
    case SET_LANGUAGE:
      return {...state,
        common: {...state.common,
          userLanguage: action.language
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
    case CHANGE_NEW_TERM_SANSKRIT:
      return {...state,
        admin: {...state.admin,
          newTerm: {...state.admin.newTerm,
            sanskrit: {...state.admin.newTerm.sanskrit,
              [action.key]: action.value
            }
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
            termId: action.termId,
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
          translator: action.translator,
          pages: action.pages
        }
      }
    case GET_ADMIN_USER_DATA_START:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            sourcePending: true,
            error: null
          }
        }
      }
    case GET_ADMIN_USER_DATA_END:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            id: action.id,
            sourcePending: false,
            error: action.error,
            data: action.data,
            dataSource: action.data
          }
        }
      }
    case UPDATE_ADMIN_USER_DATA_START:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            pending: true,
            error: null
          }
        }
      }
    case UPDATE_ADMIN_USER_DATA_END:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            pending: false,
            error: action.error,
            dataSource: action.data
          }
        }
      }
    case CHANGE_ADMIN_USER_DATA:
      return {...state,
        admin: {...state.admin,
          editUser: {...state.admin.editUser,
            data: action.payload
          }
        }
      }
    case SET_ADMIN_USER_ID:
      return {...state,
        admin: {...state.admin,
          editUserPassword: {...initialState.admin.editUserPassword,
            id: action.id
          }
        }
      }
    case UPDATE_ADMIN_USER_PASSWORD_START:
      return {...state,
        admin: {...state.admin,
          editUserPassword: {...state.admin.editUserPassword,
            pending: true
          }
        }
      }
    case UPDATE_ADMIN_USER_PASSWORD_END:
      return {...state,
        admin: {...state.admin,
          editUserPassword: {...initialState.admin.editUserPassword,
            id: state.admin.editUserPassword.id,
            error: action.error
          }
        }
      }
    case CHANGE_ADMIN_USER_PASSWORD:
      return {...state,
        admin: {...state.admin,
          editUserPassword: {...state.admin.editUserPassword,
            password: action.password,
            confirmPassword: action.confirmPassword
          }
        }
      }
    case UPDATE_TRANSLATOR_PASSWORD_START:
      return {...state,
        translator: {...state.translator,
          editPassword: {...state.translator.editPassword,
            pending: true
          }
        }
      }
    case UPDATE_TRANSLATOR_PASSWORD_END:
      return {...state,
        translator: {...state.translator,
          editPassword: {...initialState.translator.editPassword,
            error: action.error
          }
        }
      }
    case CHANGE_TRANSLATOR_PASSWORD:
      return {...state,
        translator: {...state.translator,
          editPassword: {...state.translator.editPassword,
            currentPassword: action.currentPassword,
            newPassword: action.newPassword,
            confirmPassword: action.confirmPassword
          }
        }
      }
    default:
      return state
  }
}

export default reducer
