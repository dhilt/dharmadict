import asyncRequest from '../helpers/remote'

import {
  TRANSLATION_REQUEST_START,
  TRANSLATION_REQUEST_END,
  CHANGE_TRANSLATION_LOCAL
} from './_constants'

function dispatchTranslationRequestEnd(dispatch, translation, termId, termName, error) {
  let translationCopy = translation ? JSON.parse(JSON.stringify(translation)) : null
  translationCopy.meanings.forEach(m => m.versions.push(''))
  return dispatch({
    type: TRANSLATION_REQUEST_END,
    termId: termId,
    termName: termName,
    translation,
    translationCopy,
    error: error
  })
}

export function selectTranslation(translatorId, termId) {
  return (dispatch, getState) => {
    let term = getState().selected.term;
    if (term) { // sync translation select
      let error = term.id !== termId ? {
        message: 'Invalid term.'
      } : null;
      let translation = !error ? term.translations.find(t => t.translatorId === translatorId) : null
      dispatchTranslationRequestEnd(dispatch, translation, termId, term.wylie, error)
    } else { // async translation request
      dispatch({
        type: TRANSLATION_REQUEST_START
      })
      console.log('Let\'s start an async term request to db! The term is "' + termId + '".')
      return asyncRequest(`term?translatorId=${translatorId}&termId=${termId}`, null, (data, error) => {
        let translation = data ? data.translation : null
        dispatchTranslationRequestEnd(dispatch, translation, data ? data.termId : '', data ? data.termName : '', error)
      })
    }
  }
}

export function onVersionChanged(meaningIndex, versionIndex, value) {
  return (dispatch, getState) => {
    let translation = getState().edit.change
    let meaning = translation.meanings[meaningIndex]
    meaning.versions[versionIndex] = value
    if(versionIndex === meaning.versions.length - 1) {
      meaning.versions.push('')
    }
    return dispatch({
      type: CHANGE_TRANSLATION_LOCAL,
      change: translation
    })
  }
}

export function onVersionRemoved(meaningIndex, versionIndex) {
  return (dispatch, getState) => {
    let translation = getState().edit.change
    let meaning = translation.meanings[meaningIndex]
    meaning.versions.splice(versionIndex, 1)
    return dispatch({
      type: CHANGE_TRANSLATION_LOCAL,
      change: translation
    })
  }
}
