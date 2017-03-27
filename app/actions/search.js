import {browserHistory} from 'react-router'
import asyncRequest from '../helpers/remote'
//import history from '../helpers/history'

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

function searchRequestAsync(dispatch, getState, cb) {
  let searchString = getState().searchState.searchString
  dispatch({
    type: SEARCH_REQUEST_START
  })
  console.log('Let\'s start an async request to db! searchString is "' + searchString + '"')
  return asyncRequest(`search?pattern=${searchString}`, null, (data, error) => {
    let searchEnd = dispatch({
      type: SEARCH_REQUEST_END,
      result: data,
      error: error
    })
    cb(data)
    return searchEnd
  })
}

export function doSearchRequestAsync(cb) {
  return (dispatch, getState) => {
    searchRequestAsync(dispatch, getState, () => null)
  }
}

export function selectTermAsync(termId) {
  return (dispatch, getState) => {
    dispatch(changeSearchString(termId.replace(/[\W_]+/g," ")))
    return searchRequestAsync(dispatch, getState, (result) => {
      if(result) {
        let term = result.find(term => term.id === termId)
        if(term) {
          dispatch(selectTerm(term));
        }
      }
    })
  }
}

export function selectTerm(term) {
  return (dispatch, getState) => {
    let location = browserHistory.getCurrentLocation()
    browserHistory.push({
      ...location,
      query: {...location.query, term: term.id}
    })
    return dispatch({
      type: SELECT_TERM,
      term
    })
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
