const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, pages, getNotificationAction, getAppPath} = require('../../_shared.js');

const actionsCreators = require(getAppPath(2) + 'actions/admin/newPage');
const types = require(getAppPath(2) + 'actions/_constants');
const reducer = require(getAppPath(2) + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('admin/newPage actions', () => {
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

  describe('function createPageAsync', () => {

    const page = pages[0];
    const startState = {...initialState,
      admin: {...initialState.admin,
        newPage: {...initialState.admin.newPage,
          data: page
        }
      }
    };

    const responseSuccess = page;
    const actions = [
      { type: types.CREATE_PAGE_START },
      { type: types.CREATE_PAGE_END },
      getNotificationAction('NewPage.success', null)
    ];
    const states = [
      {...initialState,
        admin: {...initialState.admin,
          newPage: {...initialState.admin.newPage,
            pending: true
          }
        }
      },
      {...initialState,
        admin: {...initialState.admin,
          newPage: {...initialState.admin.newPage,
            pending: false
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t create new page. Database error'
    };
    const actionsFail = [
      actions[0],
      actions[1],
      getNotificationAction(null, responseFail)
    ];
    const statesFail = states;

    it('should work, reducer', () => {
      expect(reducer(initialState, actions[0])).toEqual(states[0]);
      expect(reducer(initialState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .post('/api/pages', {
          payload: page
        })
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.createPageAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .post('/api/pages', {
          payload: page
        })
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.createPageAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function changePageData', () => {

    let page = Object.assign({}, pages[0]);

    const testChangePageData = (key, value) => {
      let pageData = page;

      const stateStart = {...initialState,
        admin: {...initialState.admin,
          newPage: {...initialState.newPage,
            data: pageData
          }
        }
      };

      const stateEnd = Object.assign({}, stateStart);
      stateEnd.admin.newPage.data[key] = value;

      const action = {
        type: types.CHANGE_NEW_PAGE_DATA,
        payload: stateEnd.admin.newPage.data
      };

      it(`should change ${key}, reducer`, () =>
        expect(reducer(stateStart, action)).toEqual(stateEnd)
      );

      it(`should change ${key}, action`, () => {
        const store = mockStore(stateStart);
        store.dispatch(actionsCreators.changePageData({[key]: value}));
        expect(store.getActions()).toEqual([action]);
      });
    };

    testChangePageData('url', 'new url of page');
    testChangePageData('title', 'new title of page');
    testChangePageData('text', 'new text of page');
  });
});
