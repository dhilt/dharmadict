const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, pages, getNotificationAction, getAppPath} = require('../../_shared.js');

const actionsCreators = require(getAppPath(2) + 'actions/pages');
const types = require(getAppPath(2) + 'actions/_constants');
const reducer = require(getAppPath(2) + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('pages actions', () => {
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

  describe('function getAllPagesAsync', () => {

    const responseSuccess = pages;
    const actions = [
      { type: types.GET_ALL_PAGES_START },
      {
        type: types.GET_ALL_PAGES_END,
        data: pages
      }
    ];
    const states = [
      {...initialState,
        pages: {...initialState.pages,
          pending: true
        }
      },
      {...initialState,
        pages: {...initialState.pages,
          pending: false,
          list: pages
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 404,
      message: 'Search error. No pages found'
    };
    const actionsFail = [
      actions[0],
      {
        type: types.GET_ALL_PAGES_END,
        data: []
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        pages: {...initialState.pages,
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
        .get('/api/pages/all')
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.getAllPagesAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/pages/all')
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.getAllPagesAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function getPageAsync', () => {

    const page = pages[0];

    const responseSuccess = page;
    const actions = [
      { type: types.GET_PAGE_START },
      {
        type: types.GET_PAGE_END,
        data: page
      }
    ];
    const states = [
      {...initialState,
        pages: {...initialState.pages,
          current: {...initialState.pages.current,
            pending: true
          }
        }
      },
      {...initialState,
        pages: {...initialState.pages,
          current: {...initialState.pages.current,
            pending: false,
            page: page
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 404,
      message: 'Search error. No page found'
    };
    const actionsFail = [
      actions[0],
      {
        type: types.GET_PAGE_END,
        data: null
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        pages: {...initialState.pages,
          current: {...initialState.pages.current,
            pending: false,
            page: null
          }
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
        .get('/api/pages?url=' + page.url)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.getPageAsync(page.url))
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/pages?url=' + page.url)
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.getPageAsync(page.url))
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
});
