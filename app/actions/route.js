import { browserHistory } from 'react-router'
import { selectTerm, selectTermAsync } from './search'
import { CHANGE_ROUTE } from './_constants'

export function goBack() {
  return (dispatch, getState) => {
    let location = getState().route.prevLocation || '/'
    dispatch({
      type: 'CHANGE_ROUTE_BACK'
    })
    browserHistory.push(location) // will force CHANGE_ROUTE action
  }
}

export function changeRoute(location) {
  return (dispatch, getState) => {
    if (location.pathname.length <= 1) {
      let state = getState()
      let prevLocation = state.route.location
      if (prevLocation && prevLocation.query.term !== location.query.term) {
        if (state.selected && state.selected.term.id !== location.query.term) {
          let term = state.search.result.find(term => term.id === location.query.term)
          if (term) {
            dispatch(selectTerm(term, true))
          } else {
            dispatch(selectTermAsync(location.query.term))
          }
        }
      }
    }
    return dispatch({
      type: CHANGE_ROUTE,
      location: location
    })
  }
}