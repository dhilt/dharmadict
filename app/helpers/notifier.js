import {notify} from '../actions/notifier'

const notifier = {
  onErrorResponse: (error, values) => {
    if(error) {
      if(typeof error !== 'string') {
        error = error.message
      }
      if(typeof error !== 'string') {
        error = 'Common.unknown_error'
      }
      return notify({type: 'danger', text: error, ttl: -1, values})
    }
  },

  onResponse: (successMessage, error, values) => {
    if (!error && typeof successMessage === 'string') {
      return notify({type: 'success', text: successMessage, values})
    }
    return notifier.onErrorResponse(error, values)
  }
}

export default notifier
