import {notify} from '../actions/notifier'

const notifier = {
  onErrorResponse: (error) => {
    if(error) {
      if(typeof error !== 'string') {
        error = error.message
      }
      if(typeof error !== 'string') {
        error = 'Common.unknown_error'
      }
      return notify({type: 'danger', text: error, ttl: -1})
    }
  },

  onResponse: (successMessage, error) => {
    if (!error && typeof successMessage === 'string') {
      return notify({type: 'success', text: successMessage})
    } 
    return notifier.onErrorResponse(error)
  }
}

export default notifier