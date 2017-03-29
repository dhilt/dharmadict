import 'babel-polyfill'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import reducer from './reducers'
import {changeRoute} from './actions/route'
import {getUserInfoAsync} from './actions/auth'
import {selectTermAsync} from './actions/search'

import './styles/main.css'
import './styles/images/favicon.ico';

import App from './components/App'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Edit from './components/Edit'

let middleware = [ thunkMiddleware ]

if(process.env.NODE_ENV !== 'production') {
  let logger = createLogger({
    // Ignore `CHANGE...` actions in the logger, since they fire after every keystroke
    predicate: (getState, action) => action && action.type && action.type.indexOf('CHANGE_') !== 0
  })
  middleware = [ ...middleware, logger ]
}

let store = createStore(reducer, applyMiddleware(...middleware))
if(store.getState().auth.token) {
  store.dispatch(getUserInfoAsync())
}

let location = browserHistory.getCurrentLocation()
if(location.query.term) {
  store.dispatch(selectTermAsync(location.query.term))
}

browserHistory.listenBefore((location) => {
  return store.dispatch(changeRoute(location))
})

function unauthorizedAccess (replace) {
  replace('/not_authorized')
  browserHistory.replace('/not_authorized')
}

function checkAuth (nextState, replace, callback) {
  let {auth} = store.getState()
  if(auth.loggedIn) {
    callback()
    return
  }
  if(auth.userInfo.promise) {
    auth.userInfo.promise.then(() => {
      if (!auth.loggedIn) {
        unauthorizedAccess(replace)
      }
      callback()
    })
  }
  else {
    unauthorizedAccess(replace)
  }
}

class Wrapper extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route component={App}>
            <Route exactly path='/' component={Home} />
            <Route exactly path='/edit' component={Edit} onEnter={checkAuth} />
            <Route exactly path='/not_authorized' component={NotFound} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(<Wrapper />, document.getElementById('app'))
