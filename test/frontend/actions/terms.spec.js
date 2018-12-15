const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, getNotificationAction, getAppPath} = require('../_shared.js');

const actionsCreators = require(getAppPath() + 'actions/terms');
const types = require(getAppPath() + 'actions/_constants');
const reducer = require(getAppPath() + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('terms actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('function getAllTermsAsync', () => {

    const terms = [{ id: 'some-id' }]
    const responseSuccess = { terms };
    const actions = [
      { type: types.GET_ALL_TERMS_START },
      { type: types.GET_ALL_TERMS_END, terms }
    ];
    const states = [
      {...initialState,
        terms: {...initialState.terms,
          pending: true
        }
      },
      {...initialState,
        terms: {...initialState.terms,
          pending: false,
          list: terms
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 404
    };
    const actionsFail = [
      actions[0],
      { type: types.GET_ALL_TERMS_END, terms: [] },
      getNotificationAction(null, 'App.get_terms_error')
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        terms: {...initialState.terms,
          pending: false,
          list: []
        }
      }
    ];

    it('should work, reducer', () => {
      expect(reducer(initialState, actions[0])).toEqual(states[0]);
      expect(reducer(initialState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/terms/all')
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.getAllTermsAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/terms/all')
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.getAllTermsAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
});
