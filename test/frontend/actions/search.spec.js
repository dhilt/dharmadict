const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, terms, getNotificationAction} = require('../_shared.js');

const actionsCreators = require('../../../app/actions/search');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('common actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    // console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('function changeSearchString', () => {
    let newSearchString = 'newSearchString';
    const expectedAction = {
      type: types.CHANGE_SEARCH_STRING,
      newSearchString
    };

    it('should work, reducer', () => {
      let expectedState = cloneState();
      Object.assign(expectedState.search, {searchString: newSearchString});
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    });

    it('should work, action', () => {
      let store = mockStore(initialState);
      store.dispatch(actionsCreators.changeSearchString(newSearchString));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  describe('function doSearchRequestAsync', () => {
    const searchString = terms[0].wylie;

    const responseSuccess = terms;
    const actions = [
      { type: types.SEARCH_REQUEST_START },
      {
        type: types.SEARCH_REQUEST_END,
        error: null,
        result: terms
      }
    ];
    const states = [
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: true
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: false,
          result: terms,
          started: true,
          error: null
        },
        selected: {...initialState.selected,
          term: null
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t find terms. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: actions[1].type,
        error: responseFail,
        data: null
      },
      getNotificationAction(null, 'SearchInput.request_error')
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: false,
          started: true,
          result: undefined,
          error: responseFail
        }
      }
    ];

    it('should work, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      expect(reducer(_initialState, actions[0])).toEqual(states[0]);
      expect(reducer(_initialState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .get(`/api/terms?pattern=${searchString}`)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.doSearchRequestAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      expect(reducer(_initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(_initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .get('/api/terms?pattern=${searchString}')
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.doSearchRequestAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
})
