import asyncRequest from '../../helpers/remote'
import notifier from '../../helpers/notifier'

import {
  UPDATE_ADMIN_PAGE_START,
  UPDATE_ADMIN_PAGE_END,
  GET_PAGE_ADMIN_START,
  GET_PAGE_ADMIN_END,
  CHANGE_PAGE_DATA,
  DELETE_PAGE_START,
  DELETE_PAGE_END
} from '../_constants'

export function getPageAdminAsync(pageUrl) {
  return (dispatch, getState) => {
    dispatch({
      type: GET_PAGE_ADMIN_START
    })
    const { dataSource } = getState().admin.editPage
    const query = 'pages?url=' + pageUrl
    return asyncRequest(query, 'get', false, (data, error) => {
      const currentUser = getState().auth.userInfo.data
      const noPermission = error ? true : !(currentUser.role === 'admin' || currentUser.id === data.author)
      dispatch({
        type: GET_PAGE_ADMIN_END,
        data: error ? dataSource : data,
        url: pageUrl,
        noPermission
      })
      error && dispatch(notifier.onErrorResponse(error))
      !error && noPermission && dispatch(notifier.onErrorResponse('Common.error_message', {error: 'You can\'t edit this page'}))
    })
  }
}

export function changePageData(_data) {
  return (dispatch, getState) => {
    const {data} = getState().admin.editPage
    const payload = {
      title: _data.hasOwnProperty('title') ? _data.title : data.title,
      text: _data.hasOwnProperty('text') ? _data.text : data.text
    }
    dispatch({
      type: CHANGE_PAGE_DATA,
      payload
    })
  }
}

export function resetPage() {
  return (dispatch, getState) => {
    dispatch({
      type: CHANGE_PAGE_DATA,
      payload: getState().admin.editPage.dataSource
    })
  }
}

export function updatePageAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_ADMIN_PAGE_START
    })
    const {url, data, dataSource} = getState().admin.editPage
    const query = 'pages?url=' + url
    return asyncRequest(query, 'patch', {payload: data}, (data, error) => {
      data && delete data.page.url
      dispatch({
        type: UPDATE_ADMIN_PAGE_END,
        data: error ? dataSource : data.page
      })
      dispatch(notifier.onResponse('EditPage.success', error))
    })
  }
}

export function removePageAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_PAGE_START
    })
    const {url} = getState().admin.editPage
    const query = 'pages?url=' + url
    return asyncRequest(query, 'delete', null, (data, error) => {
      dispatch({
        type: DELETE_PAGE_END
      })
      dispatch(notifier.onResponse('EditPage.successful_remove', error))
    })
  }
}
