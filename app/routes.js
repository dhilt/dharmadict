import React, {Component} from 'react'
import {Router, Route, browserHistory} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import About from './components/About'
import NotFound from './components/NotFound'
import Edit from './components/Edit'
import TranslatorPage from './components/TranslatorPage'

import NewTerm from './components/NewTerm'
import EditUser from './components/admin/EditUser'

const Routes = props => {

  function unauthorizedAccess (replace) {
    replace('/not_authorized')
    browserHistory.replace('/not_authorized')
  }

  function unpermittedAccess (replace) {
    replace('/not_permitted')
    browserHistory.replace('/not_permitted')
  }

  function checkAuth (nextState, replace, callback, role) {
    let {auth} = props
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

  return (
    <Router history={browserHistory}>
      <Route component={App}>
        <Route exactly path='/' component={Home} />
        <Route exactly path='/about' component={About} />
        <Route exactly path='/edit' component={Edit} onEnter={checkAuth} />
        <Route exactly path='/newTerm' component={NewTerm} onEnter={(...args) => checkAuth(...args, 'admin')} />
        <Route exactly path='/translator/:login' component={TranslatorPage} />
        <Route exactly path='/translator/:login/edit' component={EditUser} onEnter={(...args) => checkAuth(...args, 'admin')} />
        <Route exactly path='/not_authorized' component={NotFound} />
        <Route exactly path='/not_permitted' component={NotFound} />
        <Route path='*' component={NotFound} />
      </Route>
    </Router>
  )
}

export default Routes
