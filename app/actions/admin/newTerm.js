import asyncRequest from '../../helpers/remote'
import {
  CHANGE_NEW_TERM_WYLIE,
  UPDATE_SANSKRIT,
  ADD_TERM_START,
  ADD_TERM_END
} from '../_constants'

export function changeWylie(newWylieString) {
  return {
    type: CHANGE_NEW_TERM_WYLIE,
    newWylieString
  }
}

export function changeSanskrit(key, value) {
  return {
    type: UPDATE_SANSKRIT,
    key,
    value
  }
}

export function saveTermAsync() {
  return (dispatch, getState) => {
    const wylie = getState().admin.newTerm.wylie
    const sanskrit = getState().admin.newTerm.sanskrit
    dispatch({
      type: ADD_TERM_START
    })
    console.log('Let\'s start a new term add request to db! The term is "' + wylie + '".')
    return asyncRequest(`newTerm`, {term: wylie, sanskrit}, (data, error) => {
      dispatch({
        type: ADD_TERM_END,
        error: error,
        termId: !error ? data.id : null
      })
    })
  }
}
