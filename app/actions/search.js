import asyncRequest from '../helpers/remote'

import {
  CHANGE_SEARCH_STRING,
  SEARCH_REQUEST_START,
  SEARCH_REQUEST_END,
  SELECT_TERM,
  TOGGLE_COMMENT
} from './_constants'

export function changeSearchString(newSearchString) {
  return {
    type: CHANGE_SEARCH_STRING,
    newSearchString
  }
}

export function doSearchRequestAsync() {
  return (dispatch, getState) => {
    let searchString = getState().searchState.searchString
    dispatch({
      type: SEARCH_REQUEST_START
    })
    console.log('Let\'s start an async request to db! searchString is "' + searchString + '"')
    return asyncRequest(`search?pattern=${searchString}`, null, (data, error) =>
      dispatch({
        type: SEARCH_REQUEST_END,
        result: data,
        error: error
      }))
  }
}

export function selectTerm(term) {
  return {
    type: SELECT_TERM,
    term
  }
}

export function toggleComment(translationIndex, meaningIndex) {
  return (dispatch, getState) => {
    let term = getState().selected.term
    let meaning = term.translations[translationIndex].meanings[meaningIndex]
    meaning.openComment = !meaning.openComment
    return dispatch({
      type: TOGGLE_COMMENT,
      term
    })
  }
}
