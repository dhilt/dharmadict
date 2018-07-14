import asyncRequest from '../../helpers/remote'
import notifier from '../../helpers/notifier'

import {
  UPDATE_PAGE_START,
  UPDATE_PAGE_END,
  GET_PAGE_FOR_EDIT_START,
  GET_PAGE_FOR_EDIT_END,
  CHANGE_PAGE_DATA,
  DELETE_PAGE_START,
  DELETE_PAGE_END
} from '../_constants'

const cutPageForEdit = page => ({
  author: page.author,
  title: page.title,
  text: page.text,
  bio: page.bio
})

export function getPageForEditAsync(url) {
  return (dispatch, getState) => {
    dispatch({
      type: GET_PAGE_FOR_EDIT_START
    })
    const { dataSource } = getState().admin.editPage
    const query = `pages?url=${url}`
    return asyncRequest(query, 'get', false, (data, error) => {
      const currentUser = getState().auth.userInfo.data
      const noPermission = error ? true : !(currentUser.role === 'admin' || currentUser.id === data.author)
      dispatch({
        type: GET_PAGE_FOR_EDIT_END,
        data: error ? dataSource : cutPageForEdit(data),
        noPermission,
        url
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
      author: _data.hasOwnProperty('author') ? _data.author : data.author,
      title: _data.hasOwnProperty('title') ? _data.title : data.title,
      text: _data.hasOwnProperty('text') ? _data.text : data.text,
      bio: _data.hasOwnProperty('bio') ? _data.bio : data.bio
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
      type: UPDATE_PAGE_START
    })
    const {url, data, dataSource} = getState().admin.editPage
    const query = `pages?url=${url}`
    return asyncRequest(query, 'patch', {payload: data}, (_data, error) => {
      dispatch({
        type: UPDATE_PAGE_END,
        dataSource: error ? dataSource : data,
        data: error ? data : cutPageForEdit(_data.page)
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
    const query = `pages?url=${url}`
    return asyncRequest(query, 'delete', null, (data, error) => {
      dispatch({
        type: DELETE_PAGE_END
      })
      dispatch(notifier.onResponse('EditPage.successful_remove', error))
    })
  }
}
