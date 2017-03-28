import { selectTerm, selectTermAsync } from './search'
import { CHANGE_ROUTE } from './_constants'

export function changeRoute(location) {
  return (dispatch, getState) => {
    if (location.pathname.length <= 1) {
      let state = getState()
      let prevLocation = state.route.location
      if (prevLocation && prevLocation.query.term !== location.query.term) {
        if (state.selected.term.id !== location.query.term) {
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