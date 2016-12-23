import asyncRequest from '../helpers/remote'

import {
  CHANGE_SEARCH_STRING,
  SEARCH_REQUEST_START,
  SEARCH_REQUEST_END,
  SELECT_TERM,
  TOGGLE_COMMENT,
  TRANSLATION_REQUEST_START,
  TRANSLATION_REQUEST_END
} from './constants'

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
  return {
    type: TOGGLE_COMMENT,
    translationIndex,
    meaningIndex
  }
}

export function selectTranslation(translatorId, termId) {
  return (dispatch, getState) => {
    let term = getState().selected.term;
    if(term) { // sync translation select
      let error = term.id !== termId ? { message: 'Invalid term.' } : null;
      let translation = !error ? term.translations.find(t => t.translatorId === translatorId) : null
      return dispatch({
        type: TRANSLATION_REQUEST_END,
        result: {
          termId: termId,
          termName: term.wylie,
          translation
        },
        error: error
      })
    }
    else { // async translation request
      dispatch({
        type: TRANSLATION_REQUEST_START
      })
      console.log('Let\'s start an async term request to db! The term is "' + termId + '".')
      return asyncRequest(`term?translatorId=${translatorId}&termId=${termId}`, null, (data, error) => {
        return dispatch({
          type: TRANSLATION_REQUEST_END,
          result: data,
          error: error
        })})
    }
  }
}
