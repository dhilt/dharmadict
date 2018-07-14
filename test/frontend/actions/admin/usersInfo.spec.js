const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, translators, getNotificationAction, getAppPath} = require('../../_shared.js');

const actionsCreators = require(getAppPath(2) + 'actions/admin/usersInfo');
const types = require(getAppPath(2) + 'actions/_constants');
const reducer = require(getAppPath(2) + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('admin/usersInfo actions', () => {
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

  describe('function getAllUsersAsync', () => {

    const responseSuccess = {
      success: true,
      users: translators
    };
    const actions = [
      { type: types.GET_ALL_USERS_START },
      {
        type: types.GET_ALL_USERS_END,
        payload: translators,
        error: null
      }
    ];
    const states = [
      {...initialState,
        admin: {...initialState.admin,
          usersList: {...initialState.admin.usersList,
            pending: true
          }
        }
      },
      { ...initialState,
        admin: { ...initialState.admin,
          usersList: {...initialState.admin.usersList,
            data: translators
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t get users. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: types.GET_ALL_USERS_END,
        error: responseFail,
        payload: []
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      {...initialState,
        admin: {...initialState.admin,
          usersList: {...initialState.admin.usersList,
            error: responseFail,
            data: []
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
        .get('/api/users/all')
        .reply((uri, requestBody, cb) => {
          cb(null, [200, responseSuccess])
        });

      return store
        .dispatch(actionsCreators.getAllUsersAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/users/all')
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.getAllUsersAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail))
      });
  });
});
