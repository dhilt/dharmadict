import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import App from './components/App'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Edit from './components/Edit'
import TranslatorPage from './components/TranslatorPage'
import Pages from './components/Pages'
import Page from './components/Page'

import NewTerm from './components/admin/NewTerm'
import EditUser from './components/admin/EditUser'
import EditUserPassword from './components/admin/EditUserPassword'
import EditPage from './components/admin/EditPage'
import NewPage from './components/admin/NewPage'

import EditPasswordByTranslator from './components/translator/EditPasswordByTranslator'

function unauthorizedAccess (replace) {
  replace('/not_authorized')
  browserHistory.replace('/not_authorized')
}

function unpermittedAccess (replace) {
  replace('/not_permitted')
  browserHistory.replace('/not_permitted')
}

function hasAccess(auth, roles, userId) {
  return auth.loggedIn
    && (!roles || (auth.userInfo.data && roles.find(e => e === auth.userInfo.data.role)))
    && (!userId || (userId === auth.userInfo.data.id))
}

function checkAccess (nextState, replace, callback, store, roles, userId) {
  let auth = store.getState().auth
  if(hasAccess(auth, roles, userId)) {
    callback()
    return
  }
  if(auth.userInfo.promise) {
    auth.userInfo.promise.then(() => {
      if(!hasAccess(store.getState().auth, roles, userId)) {
        unauthorizedAccess(replace)
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
    { path: '/edit', exactly: true, component: Edit },
    {
      path: '/newTerm',
      exactly: true,
      component: NewTerm,
      onEnter: (...args) => checkAccess(...args, store, ['admin'])
    },
    { path: '/translator/:id', exactly: true, component: TranslatorPage },
    {
      path: '/translator/:id/edit',
      exactly: true,
      component: EditUser,
      onEnter: (...args) => checkAccess(...args, store, ['admin'])
    },
    {
      path: '/translator/:id/edit/password',
      exactly: true,
      component: EditUserPassword,
      onEnter: (...args) => checkAccess(...args, store, ['admin'])
    },
    {
      path: '/translator/:id/password',
      exactly: true,
      component: EditPasswordByTranslator,
      onEnter: (...args) => checkAccess(...args, store, ['translator'], args[0].params.id)
    },
    { path: '/pages', exactly: true, component: Pages },
    {
      path: '/pages/new',
      exactly: true,
      component: NewPage,
      onEnter: (...args) => checkAccess(...args, store, ['admin', 'translator'])
    },
    { path: '/pages/:pageUrl', exactly: true, component: Page },
    {
      path: '/pages/:pageUrl/edit',
      exactly: true,
      component: EditPage,
      onEnter: (...args) => checkAccess(...args, store, ['admin', 'translator'])
    },
    { path: '/not_authorized', exactly: true, component: NotFound },
    { path: '/not_permitted', exactly: true, component: NotFound },
    { path: '*', component: NotFound }
  ]
});

export default getRoutes
