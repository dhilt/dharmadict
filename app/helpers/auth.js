let tokenNameLS = 'dharmadictToken'
const localStorage = global.window.localStorage
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
