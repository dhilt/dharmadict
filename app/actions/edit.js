import asyncRequest from '../helpers/remote'

import {
  TRANSLATION_REQUEST_START,
  TRANSLATION_REQUEST_END
} from './_constants'

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
