import {
  CREATE_NOTIFY,
  REMOVE_NOTIFY
} from './_constants'

export function notify(notice) {
  return (dispatch, getState) => {
    const notifications = getState().notifications.data
    notice.id = notifications.length
    notifications.push(notice)
    dispatch({
      type: CREATE_NOTIFY,
      notifications
    })
  }
}

export function removeNotify(id) {
  return (dispatch, getState) => {
    let notifications = getState().notifications.data
    notifications = notifications.filter(elem => elem.id !== id)
    dispatch({
      type: REMOVE_NOTIFY,
      notifications
    })
  }
}
