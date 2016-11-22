import 'babel-polyfill'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import reducer from './reducers'
import {getUserInfoAsync} from './actions'

import './styles/main.css'

import App from './components/App'
import Home from './components/Home'
import Search from './components/Search'
import SearchInput from './components/search/SearchInput'
import ResultList from './components/search/ResultList'
import ResultItem from './components/search/ResultItem'
import Dashboard from './components/Dashboard'
import NotFound from './components/NotFound'

let logger = createLogger({
  // Ignore `CHANGE...` actions in the logger, since they fire after every keystroke
  predicate: (getState, action) => action.type && action.type.indexOf('CHANGE_') !== 0
})

let store = createStore(reducer, applyMiddleware(logger, thunkMiddleware))
let userInfoPromise = store.dispatch(getUserInfoAsync())

function checkAuth (nextState, replace, callback) {
  let {auth} = store.getState()
  userInfoPromise.then(() => {
    if (!auth.loggedIn) {
      replace('/not_authorized')
      browserHistory.replace('/not_authorized')
    }
    callback();
  })
}

class LoginFlow extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route component={App}>
            <Route path='/' component={Home} />
            <Route>
              <Route path='/edit' component={Dashboard} onEnter={checkAuth}/>
            </Route>
            <Route path='/not_authorized' component={NotFound} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(<LoginFlow />, document.getElementById('app'))
