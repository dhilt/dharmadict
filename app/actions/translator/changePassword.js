import asyncRequest from '../../helpers/remote'
import notifier from '../../helpers/notifier'

import {
  UPDATE_TRANSLATOR_PASSWORD_START,
  UPDATE_TRANSLATOR_PASSWORD_END,
  CHANGE_TRANSLATOR_PASSWORD
} from '../_constants'

export function updateTranslatorPasswordAsync(id) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_TRANSLATOR_PASSWORD_START
    })
    const {currentPassword, newPassword, confirmPassword} = getState().translator.editPassword
    const data = {currentPassword, newPassword, confirmPassword}
    const query = 'translators/' + id
    return asyncRequest(query, 'patch', {payload: data}, (data, error) => {
      dispatch({
        type: UPDATE_TRANSLATOR_PASSWORD_END,
        error: error ? error : null
      })
      dispatch(notifier.onResponse('EditPasswordByTranslator.new_password_success', error))
    })
  }
}

export function changeTranslatorPassword(_data) {
  return (dispatch, getState) => {
    const {editPassword} = getState().translator
    dispatch({
      type: CHANGE_TRANSLATOR_PASSWORD,
      currentPassword: _data.hasOwnProperty('currentPassword') ? _data.currentPassword : editPassword.currentPassword,
      newPassword: _data.hasOwnProperty('newPassword') ? _data.newPassword : editPassword.newPassword,
      confirmPassword: _data.hasOwnProperty('confirmPassword') ? _data.confirmPassword : editPassword.confirmPassword
    })
  }
}

export function resetTranslatorPasswords() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_TRANSLATOR_PASSWORD,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }
}
