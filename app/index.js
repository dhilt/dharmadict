import 'babel-polyfill'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {browserHistory} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import reducer from './reducers'
import {changeRoute} from './actions/route'
import {getUserInfoAsync} from './actions/auth'
import {selectTermAsync} from './actions/search'

import Routes from './routes'
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

let location = browserHistory.getCurrentLocation()
if(location.query.term) {
  store.dispatch(selectTermAsync(location.query.term))
}

browserHistory.listenBefore((location) => {
  return store.dispatch(changeRoute(location))
})

ReactDOM.render(
  <Provider store={store}>
    <Routes auth={store.getState().auth} />
  </Provider>,
  document.getElementById('app')
)
