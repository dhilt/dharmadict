import {
  CREATE_NOTIFICATION,
  REMOVE_NOTIFICATION
} from './_constants'

export function notify(notification) {
  return (dispatch, getState) => {
    const idLast = getState().notifications.idLast + 1
    notification.id = idLast
    dispatch({
      type: CREATE_NOTIFICATION,
      idLast,
      notification
    })
  }
}

export function removeNotify(id) {
  return (dispatch, getState) => {
    let notifications = getState().notifications.list
    notifications = notifications.filter(elem => elem.id !== id)
    dispatch({
      type: REMOVE_NOTIFICATION,
      notifications
    })
  }
}
