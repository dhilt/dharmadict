import {
  CREATE_NOTIFICATION,
  REMOVE_NOTIFICATION
} from './_constants'

export const defaultNotification = {
  type: 'info',
  ttl: 3000
}

export function notify(notification) {
  return (dispatch, getState) => {
    const idLast = getState().notifications.idLast + 1
    notification.id = idLast
    notification.values = notification.values || {}
    if (!notification.hasOwnProperty('type')) {
      notification.type = defaultNotification.type
    }
    if (!notification.hasOwnProperty('ttl')) {
      notification.ttl = defaultNotification.ttl
    }
    if(process.env.NODE_ENV !== 'test') {
      if(notification.ttl > 0) {
        notification.timer = setTimeout(() =>
          dispatch(removeNotify(idLast)), notification.ttl
        )
      }
    }
    dispatch({
      type: CREATE_NOTIFICATION,
      idLast,
      notification
    })
  }
}

export function removeNotify(id, force) {
  return (dispatch, getState) => {
    let notifications = getState().notifications.list
    notifications = notifications.filter(elem => {
      if(elem.id !== id) {
        return true
      }
      if(force && elem.timer) {
        clearTimeout(elem.timer)
      }
    })
    dispatch({
      type: REMOVE_NOTIFICATION,
      notifications
    })
  }
}
