import asyncRequest from '../../helpers/remote'
import notifier from '../../helpers/notifier'

import {
  CREATE_PAGE_START,
  CREATE_PAGE_END,
  CHANGE_NEW_PAGE_DATA
} from '../_constants'

export function createPageAsync() {
  return (dispatch, getState) => {
    dispatch({
      type: CREATE_PAGE_START
    })
    const author = getState().auth.userInfo.data.id
    const data = {...getState().admin.newPage.data, author}
    const query = 'pages'
    return asyncRequest(query, 'post', {payload: data}, (data, error) => {
      dispatch({
        type: CREATE_PAGE_END
      })
      dispatch(notifier.onResponse('NewPage.success', error))
    })
  }
}

export function changePageData(_data) {
  return (dispatch, getState) => {
    const {data} = getState().admin.newPage
    const payload = {
      url: _data.hasOwnProperty('url') ? _data.url : data.url,
      bio: _data.hasOwnProperty('bio') ? _data.bio : data.bio,
      title: _data.hasOwnProperty('title') ? _data.title : data.title,
      text: _data.hasOwnProperty('text') ? _data.text : data.text
    }
    dispatch({
      type: CHANGE_NEW_PAGE_DATA,
      payload
    })
  }
}
