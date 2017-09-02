import asyncRequest from '../helpers/remote'
import {
  CHANGE_NEW_TERM_NAME,
  ADD_TERM_START,
  ADD_TERM_END
} from './_constants'

export function changeTerm(newTermString) {
  return {
    type: CHANGE_NEW_TERM_NAME,
    newTermString
  }
}

export function saveTermAsync() {
  return (dispatch, getState) => {
    let newTermSate = getState().newTerm
    let term = newTermSate.term
    dispatch({
      type: ADD_TERM_START
    })
    console.log('Let\'s start a new term add request to db! The term is "' + term + '".')
    return asyncRequest(`newTerm`, {
      term: term
    }, (data, error) => {
      dispatch({
        type: ADD_TERM_END,
        error: error,
        term: !error ? data.term : null
      })
    })
  }
}
