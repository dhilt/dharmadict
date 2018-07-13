import React from 'react'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'

import LoadingButton from './LoadingButton'
import Login from './Login'
import Logout from './Logout'

function AuthLinks ({
  data, onPasswordChange, onLoginChange, closeModal, openModal, doLogout, doLogin
}) {
  const userInfo = !data.userInfo.pending ? data.userInfo.data : {}
  return data.loggedIn ? (
    <div data-test-id="Header.navButtons-loggedIn">
      <Link data-test-id="Header.link_to_user"
            to={`/translator/${userInfo.id}`}>
        {userInfo.name}
      </Link>
      <Logout data-test-id="Header.Logout" doLogout={doLogout} />
      {
        userInfo.role === 'admin' ?
          <Link data-test-id="Header.link_create_term" to={`/newTerm`}>
            <FormattedMessage id="Header.create_new_term" />
          </Link> : null
      }
      {
        ['admin', 'translator'].find(e => e === userInfo.role) && (
          <Link data-test-id="Header.link_create_page" to={`/pages/new`}>
            <FormattedMessage id="Header.create_new_page" />
          </Link>
        )
      }
    </div>
  ) : (
    <div data-test-id="Header.navButtons-notLoggedIn">
      {data.userInfo.pending ?
        <LoadingButton data-test-id="Header.LoadingButton" className="btn--nav" />
        :
        <Login data-test-id="Header.Login"
               onPasswordChange={onPasswordChange}
               onLoginChange={onLoginChange}
               closeModal={closeModal}
               openModal={openModal}
               doLogin={doLogin}
               data={data}
        />
      }
    </div>
  )
}

export default AuthLinks
