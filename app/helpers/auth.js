let localStorage
let tokenNameLS = 'dharmadictToken'

// If we're testing, use a local storage polyfill
if (global.process && process.env.NODE_ENV === 'test') {
  localStorage = require('localStorage')
} else {
  // If not, use the browser one
  localStorage = global.window.localStorage
}

let auth = {
  initialState: null,

  initialize(initialState) {
    this.initialState = initialState
    this.setInitialStateParams()
  },

  getToken() {
    return localStorage[tokenNameLS] || null
  },

  loggedIn() {
    return !!localStorage[tokenNameLS]
  },

  setToken(token) {
    localStorage[tokenNameLS] = token
    this.setInitialStateParams()
  },

  removeToken() {
    delete localStorage[tokenNameLS]
    this.setInitialStateParams()
  },

  setInitialStateParams() {
    this.initialState['loggedIn'] = this.loggedIn()
    this.initialState['token'] = this.getToken()
  }
}

export default auth
