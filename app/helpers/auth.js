let localStorage

// If we're testing, use a local storage polyfill
if (global.process && process.env.NODE_ENV === 'test') {
  localStorage = require('localStorage')
} else {
  // If not, use the browser one
  localStorage = global.window.localStorage
}

let auth = {
  getToken() {
    return localStorage.token
  },

  setToken(token) {
    localStorage.token = token
  },

  removeToken() {
    delete localStorage.token
  },

  loggedIn() {
    return !!localStorage.token
  }
}

export default auth
