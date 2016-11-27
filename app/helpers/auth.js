let localStorage

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
    return localStorage.token || null
  },

  loggedIn() {
    return !!localStorage.token
  },

  setToken(token) {
    localStorage.token = token
    this.setInitialStateParams()
  },

  removeToken() {
    delete localStorage.token
    this.setInitialStateParams()
  },

  setInitialStateParams() {
    this.initialState['loggedIn'] = this.loggedIn()
    this.initialState['token'] = this.getToken()
  }
}

export default auth
