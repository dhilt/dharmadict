import {selectTerm} from './search'

import {
  CHANGE_ROUTE
} from './_constants'

export function changeRoute(location) {
  return (dispatch, getState) => {
    return dispatch({
      type: CHANGE_ROUTE,
      location: location
    })
  }
}