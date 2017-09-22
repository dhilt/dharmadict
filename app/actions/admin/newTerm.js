import asyncRequest from '../../helpers/remote'
import {
  CHANGE_NEW_TERM,
  UPDATE_SANSKRIT,
  ADD_TERM_START,
  ADD_TERM_END
} from '../_constants'

export function changeTerm(newTermString) {
  return {
    type: CHANGE_NEW_TERM,
    newTermString
  }
}

export function changeSanskrit(type, info) {
  return (dispatch, getState) => {
    let payload = getState().admin.newTerm.sanskrit
    payload[type] = info
    dispatch({
      type: UPDATE_SANSKRIT,
      payload
    })
  }
}

export function saveTermAsync() {
  return (dispatch, getState) => {
    const term = getState().admin.newTerm.term
    const sanskrit = getState().admin.newTerm.sanskrit
    dispatch({
      type: ADD_TERM_START
    })
    console.log('Let\'s start a new term add request to db! The term is "' + term + '".')
    return asyncRequest(`newTerm`, {term, sanskrit}, (data, error) => {
      dispatch({
        type: ADD_TERM_END,
        error: error,
        termId: !error ? data.id : null
      })
    })
  }
}
