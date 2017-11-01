import {notify} from '../actions/notifier'

const notifier = {
  // onErrorResponse: (error, values = {}) => {
  //   if(error) {
  //     if(typeof error !== 'string') {
  //       error = error.message
  //     }
  //     if(typeof error !== 'string') {
  //       error = 'Common.unknown_error'
  //     }
  //     return notify({type: 'danger', text: error, ttl: -1, values})
  //   }
  // },

  onErrorResponse: (error, values = {}) => {
    if(error.message) {  // if this is a server-error
      values = { error: error.message }
      error = 'Common.error_message'
      return notify({type: 'danger', text: error, ttl: -1, values})
    } else if (typeof error === 'string') {
      return notify({type: 'danger', text: error, ttl: -1, values})
    } else {
      error = 'Common.unknown_error'
      return notify({type: 'danger', text: error, ttl: -1, values})
    }
  },

  onResponse: (successMessage, error, values = {}) => {
    if (!error && typeof successMessage === 'string') {
      return notify({type: 'success', text: successMessage, values})
    }
    return notifier.onErrorResponse(error, values)
  }
}

export default notifier
