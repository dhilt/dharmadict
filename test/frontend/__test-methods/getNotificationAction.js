const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

const notifier = require('../../../app/helpers/notifier').default;
const initialState = require('../../../app/reducers/_initial').default;

const getNotificationAction = (successMessage, error, values = {}) => {
  const store = mockStore(initialState);
  store.dispatch(notifier.onResponse(successMessage, error, values));
  return store.getActions()[0]
};

module.exports = getNotificationAction;
