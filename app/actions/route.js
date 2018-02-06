import { browserHistory } from 'react-router'
import { selectTerm, selectTermAsync } from './search'
import { CHANGE_ROUTE } from './_constants'
import { getPageAsync } from './pages';

export function setStartLocation(location) {
  return (dispatch, getState) => {
    if(location.query.term) {
      dispatch(selectTermAsync(location.query.term))
    }
    else if (location.pathname.indexOf('/pages/') === 0) {
      dispatch(getPageAsync(location.pathname.replace('/pages/', '')))
    }
  }
}

export function goBack(isEdit) {
  return (dispatch, getState) => {
    let location = getState().route.prevLocation || '/'
    dispatch({
      type: 'CHANGE_ROUTE_BACK'
    })
    browserHistory.push(location) // will force CHANGE_ROUTE action

    // go back from Edit if no history
    if(location === '/' && isEdit) {
      dispatch(selectTermAsync(getState().edit.termId))
    }
  }
}

export function changeRoute(location) {
  return (dispatch, getState) => {
    const state = getState()
    const prevLocation = state.route.location
    // /?term=chos
    if (location.pathname.length <= 1 && location.query.term) {
      if (prevLocation && prevLocation.query.term !== location.query.term) {
        if (state.selected.term && state.selected.term.id !== location.query.term) {
          let term = state.search.result.find(term => term.id === location.query.term)
          if (term) {
            dispatch(selectTerm(term, true))
          } else {
            dispatch(selectTermAsync(location.query.term))
          }
        }
      }
    }
    // pages/about
    if (location.pathname.indexOf('/pages/') === 0) {
      if(!prevLocation || prevLocation.pathname !== location.pathname) {
        dispatch(getPageAsync(location.pathname.replace('/pages/', '')))
      }
    }
    return dispatch({
      type: CHANGE_ROUTE,
      location: location
    })
  }
}