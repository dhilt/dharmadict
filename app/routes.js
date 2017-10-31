import React, {Component} from 'react'
import {Router, Route, browserHistory} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import About from './components/About'
import NotFound from './components/NotFound'
import Edit from './components/Edit'
import TranslatorPage from './components/TranslatorPage'

import NewTerm from './components/admin/NewTerm'
import EditUser from './components/admin/EditUser'
import EditUserPassword from './components/admin/EditUserPassword'

import EditPasswordByTranslator from './components/translator/EditPasswordByTranslator'

function unauthorizedAccess (replace) {
  replace('/not_authorized')
  browserHistory.replace('/not_authorized')
}

function unpermittedAccess (replace) {
  replace('/not_permitted')
  browserHistory.replace('/not_permitted')
}

function checkAuth (nextState, replace, callback, store, role, userId) {
  let auth = store.getState().auth
  if(auth.loggedIn && (!role || (auth.userInfo.data && auth.userInfo.data.role === role))) {
    callback()
    return
  }
  if(auth.userInfo.promise) {
    auth.userInfo.promise.then(() => {
      auth = store.getState().auth
      const userInfo = auth.userInfo.data
      if (!auth.loggedIn) {
        unauthorizedAccess(replace)
      }
      if (role && (!userInfo || userInfo.role !== role)) {
        unpermittedAccess(replace)
      }
      if (userId && userId !== userInfo.id) {
        unpermittedAccess(replace)
      }
      callback()
    })
  }
  else {
    unauthorizedAccess(replace)
  }
}

const getRoutes = (store) => ({
  component: App,
  childRoutes: [
    { path: '/', exactly: true, component: Home },
    { path: '/about', exactly: true, component: About },
    { path: '/edit', exactly: true, component: Edit },
    {
      path: '/newTerm',
      exactly: true,
      component: NewTerm,
      onEnter: (...args) => checkAuth(...args, store, 'admin')
    },
    { path: '/translator/:id', exactly: true, component: TranslatorPage },
    {
      path: '/translator/:id/edit',
      exactly: true,
      component: EditUser,
      onEnter: (...args) => checkAuth(...args, store, 'admin')
    },
    {
      path: '/translator/:id/edit/password',
      exactly: true,
      component: EditUserPassword,
      onEnter: (...args) => checkAuth(...args, store, 'admin')
    },
    {
      path: '/translator/:id/password',
      exactly: true,
      component: EditPasswordByTranslator,
      onEnter: (...args) => checkAuth(...args, store, 'translator', args[0].params.id)
    },
    { path: '/not_authorized', exactly: true, component: NotFound },
    { path: '/not_permitted', exactly: true, component: NotFound },
    { path: '*', component: NotFound }
  ]
});

export default getRoutes
