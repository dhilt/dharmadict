import auth from '../helpers/auth'
import lang from '../helpers/lang'

let initialState = {
  common: {
    userLanguage: '',
    translators: null,
    languages: null
  },
  notifications: {
    data: [],
    mock: false
  },
  route: {
    prevLocation: null,
    location: null
  },
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
  search: {
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
    started: false,
    termId: '',
    termName: '',
    source: null,
    change: null,
    pending: false,
    error: null,
    update: {
      pending: false,
      error: null
    }
  },
  translatorInfo: {
    pending: false,
    error: null,
    data: {
      name: '',
      role: '',
      language: '',
      description: ''
    }
  },
  admin: {
    newTerm: {
      wylie: '',
      sanskrit: {},
      termId: null,
      pending: false,
      error: null
    },
    editUser: {
      id: '',
      dataSource: {
        name: '',
        language: '',
        description: ''
      },
      data: {
        name: '',
        language: '',
        description: ''
      },
      pending: false,
      error: null
    },
    editUserPassword: {
      id: '',
      password: '',
      confirmPassword: '',
      pending: false,
      result: null,
      error: null
    }
  }
}

auth.initialize(initialState.auth)
lang.initialize(initialState.common)

export default initialState
