import 'babel-polyfill'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {browserHistory, Router} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import ConnectedIntlProvider from './ConnectedIntlProvider'

import App from './components/App'
import Home from './components/Home'
import About from './components/About'
import NotFound from './components/NotFound'
import Edit from './components/Edit'
import TranslatorPage from './components/TranslatorPage'
import NewTerm from './components/admin/NewTerm'
import EditUser from './components/admin/EditUser'

import reducer from './reducers'
import {changeRoute} from './actions/route'
import {getUserInfoAsync} from './actions/auth'
import {getCommonDataAsync} from './actions/common'
import {selectTermAsync} from './actions/search'

// import Routes from './routes'
import './styles/main.css'
import './styles/images/favicon.ico';

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

store.dispatch(getCommonDataAsync())

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

function unpermittedAccess (replace) {
  replace('/not_permitted')
  browserHistory.replace('/not_permitted')
}

function checkAuth (nextState, replace, callback, role) {
  const auth = store.getState().auth
  if(auth.loggedIn && (!role || (auth.userInfo.data && auth.userInfo.data.role === role))) {
    callback()
    return
  }
  if(auth.userInfo.promise) {
    auth.userInfo.promise.then(response => {
      if (!auth.loggedIn) {
        unauthorizedAccess(replace)
      }
      if (role && (!response || !response.result || response.result.role !== role)) {
        unpermittedAccess(replace)
      }
      callback()
    })
  }
  else {
    unauthorizedAccess(replace)
  }
}

const routes = {
  component: App,
  childRoutes: [
    { path: '/', exactly: true, component: Home },
    { path: '/about', exactly: true, component: About },
    { path: '/edit', exactly: true, component: Edit },
    {
      path: '/newTerm',
      exactly: true,
      component: NewTerm,
      onEnter: (...args) => checkAuth(...args, 'admin')
    },
    { path: '/translators/:id', exactly: true, component: TranslatorPage },
    {
      path: '/translators/:id/edit',
      exactly: true,
      component: EditUser,
      onEnter: (...args) => checkAuth(...args, 'admin')
    },
    { path: '/not_authorized', exactly: true, component: NotFound },
    { path: '/not_permitted', exactly: true, component: NotFound },
    { path: '*', component: NotFound }
  ]
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router history={browserHistory} routes={routes} />
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('app')
)
