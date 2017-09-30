import auth from '../helpers/auth'

let initialState = {
  common: {
    userLanguage: 'en',
    translators: null,
    languages: null
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
    }
  }
}

auth.initialize(initialState.auth)

export default initialState
