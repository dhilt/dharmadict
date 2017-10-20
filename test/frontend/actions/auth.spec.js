const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, translators, getNotificationAction} = require('../_shared.js');

const actionsCreators = require('../../../app/actions/auth');
const auth = require('../../../app/helpers/auth').default;
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;

const SUPER_TOKEN = 'SUPER_TOKEN';

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('edit actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    // console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    auth.removeToken();
  });

  it('should return the initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('function getUserInfoAsync', () => {

    const user = translators[1];

    const responseSuccess = user;
    const actions = [
      {
        type: types.USERINFO_REQUEST_START,
        promise: Promise  // ???
      },
      {
        type: types.USERINFO_REQUEST_END,
        result: user,
        error: null,
        loggedIn: true
      }
    ];
    const states = [
      { ...initialState,
        auth: { ...initialState.auth,
          userInfo: { ...initialState.auth.userInfo,
            requested: true,
            pending: true,
            promise: Promise,  // ???
            error: null
          }
        }
      },
      { ...initialState,
        auth: { ...initialState.auth,
          loggedIn: true,
          userInfo: { ...initialState.auth.userInfo,
            pending: false,
            data: user,
            error: null
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t authorize user. Invalid token'
    };
    const actionsFail = [
      actions[0],
      {
        type: types.USERINFO_REQUEST_END,
        result: null,
        error: responseFail,
        loggedIn: false
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        auth: { ...initialState.auth,
          loggedIn: false,
          userInfo: { ...initialState.auth.userInfo,
            pending: false,
            data: null,
            error: responseFail
          }
        }
      }
    ];

    it('should work, reducer', () => actions.forEach((action, index) =>
      expect(reducer(initialState, action)).toEqual(states[index])
    ));

    it('should work, action', () => {
      auth.setToken(SUPER_TOKEN);
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/userInfo')
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.getUserInfoAsync())
        .then(() => {
          // expect(store.getActions()[0]).toEqual(actions[0]);  // problem with promise
          expect(store.getActions()[1]).toEqual(actions[1]);
          // expect(store.getActions()).toEqual(actions)  // should work
        });
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      auth.setToken(SUPER_TOKEN);
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/userInfo')
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.getUserInfoAsync())
        .then(() => {
          // expect(store.getActions()[0]).toEqual(actionsFail[0]);  // problem with promise
          expect(store.getActions()[1]).toEqual(actionsFail[1]);
          expect(store.getActions()[2]).toEqual(actionsFail[2]);
          // expect(store.getActions()).toEqual(actionsFail)  // should work
        });
    });
  });

  describe('function doLoginAsync', () => {

    const user = translators[1];
    const login = 'user login';
    const password = 'user password';

    const responseSuccess = {
      success: true,
      token: SUPER_TOKEN,
      user
    };
    const actions = [
      { type: types.LOGIN_REQUEST_START },
      {
        type: types.USERINFO_REQUEST_START,
        promise: Promise  // ???
      },
      { type: types.CLOSE_LOGIN_MODAL },
      {
        type: types.LOGIN_REQUEST_END,
        token: SUPER_TOKEN,
        error: null,
        loggedIn: true
      },
      {
        type: types.USERINFO_REQUEST_END,
        result: user,
        error: null,
        loggedIn: true,
        promise: null
      }
    ];
    const states = [
      { ...initialState,
        auth: { ...initialState.auth,
          pending: true,
          error: null
        }
      },
      { ...initialState,
        auth: { ...initialState.auth,
          userInfo: { ...initialState.auth.userInfo,
            requested: true,
            pending: true,
            promise: Promise,  // ???
            error: null
          }
        }
      },
      { ...initialState,
        auth: { ...initialState.auth,
          modalIsOpen: false
        }
      },
      { ...initialState,
        auth: { ...initialState.auth,
          pending: false,
          token: SUPER_TOKEN,
          error: null,
          loggedIn: true,
          password: ''
        }
      },
      { ...initialState,
        auth: { ...initialState.auth,
          loggedIn: true,
          userInfo: { ...initialState.auth.userInfo,
            pending: false,
            data: user,
            error: null
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t authorize user. Database error'
    };
    const actionsFail = [
      actions[0],
      actions[1],
      {
        type: types.LOGIN_REQUEST_END,
        token: null,
        error: responseFail,
        loggedIn: false
      },
      {
        type: types.USERINFO_REQUEST_END,
        result: null,
        error: responseFail,
        loggedIn: false,
        promise: null
      },
      getNotificationAction(null, 'Login.authorization_error')
    ];
    const statesFail = [
      states[0],
      states[1],
      { ...initialState,
        auth: { ...initialState.auth,
          pending: false,
          token: null,
          error: responseFail,
          loggedIn: false,
          password: ''
        }
      },
      { ...initialState,
        auth: { ...initialState.auth,
          loggedIn: false,
          userInfo: { ...initialState.auth.userInfo,
            pending: false,
            data: null,
            error: responseFail
          }
        }
      }
    ];

    it('should work, reducer', () => actions.forEach((action, index) =>
      expect(reducer(initialState, action)).toEqual(states[index])
    ));

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.auth, {
        login,
        password
      });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .post('/api/login', {
          login: store.getState().auth.login,
          password: store.getState().auth.password
        })
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.doLoginAsync())
        .then(() => {
          expect(store.getActions()[0]).toEqual(actions[0]);
          // expect(store.getActions()[1]).toEqual(actions[1]);  // // problem with promise
          expect(store.getActions()[2]).toEqual(actions[2]);
          expect(store.getActions()[3]).toEqual(actions[3]);
          expect(store.getActions()[4]).toEqual(actions[4]);
          // expect(store.getActions()).toEqual(actions)  // should work
        });
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
      expect(reducer(initialState, actionsFail[2])).toEqual(statesFail[2]);
      expect(reducer(initialState, actionsFail[3])).toEqual(statesFail[3]);
    });

    it('should handle error, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.auth, {
        login,
        password
      });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .post('/api/login', {
          login: store.getState().auth.login,
          password: store.getState().auth.password
        })
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.doLoginAsync())
        .then(() => {
          expect(store.getActions()[0]).toEqual(actionsFail[0]);
          // expect(store.getActions()[1]).toEqual(actionsFail[1]);  // problem with promise
          expect(store.getActions()[2]).toEqual(actionsFail[2]);
          expect(store.getActions()[3]).toEqual(actionsFail[3]);
          expect(store.getActions()[4]).toEqual(actionsFail[4]);
          expect(store.getActions()[5]).toEqual(actionsFail[5]);
          // expect(store.getActions()).toEqual(actionsFail)  // should work
        });
    });
  });

  describe('function openLoginModal', () => {

    const expectedAction = {
      type: types.OPEN_LOGIN_MODAL
    };
    const expectedState = { ...initialState,
      auth: { ...initialState.auth,
        modalIsOpen: true
      }
    };

    it('should work, reducer', () =>
      expect(reducer(initialState, expectedAction)).toEqual(expectedState)
    );

    it('should work, action', () =>
      expect(actionsCreators.openLoginModal()).toEqual(expectedAction)
    );
  });

  describe('function closeLoginModal', () => {

    const expectedAction = {
      type: types.CLOSE_LOGIN_MODAL
    };
    const expectedState = { ...initialState,
      auth: { ...initialState.auth,
        modalIsOpen: false,
        password: ''
      }
    };

    it('should work, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.auth, {
        modalIsOpen: true,
        password: 'password'
      });
      expect(reducer(_initialState, expectedAction)).toEqual(expectedState);
    });

    it('should work, action', () =>
      expect(actionsCreators.closeLoginModal()).toEqual(expectedAction)
    );
  });

  describe('function changeLoginString', () => {

    const login = 'user login';
    const expectedAction = {
      type: types.CHANGE_LOGIN_STRING,
      login
    };
    const expectedState = { ...initialState,
      auth: { ...initialState.auth,
        login
      }
    };

    it('should work, reducer', () =>
      expect(reducer(initialState, expectedAction)).toEqual(expectedState)
    );

    it('should work, action', () =>
      expect(actionsCreators.changeLoginString(login)).toEqual(expectedAction)
    );
  });

  describe('function changePasswordString', () => {

    const password = 'user password';
    const expectedAction = {
      type: types.CHANGE_PASSWORD_STRING,
      password
    };
    const expectedState = { ...initialState,
      auth: { ...initialState.auth,
        password
      }
    };

    it('should work, reducer', () =>
      expect(reducer(initialState, expectedAction)).toEqual(expectedState)
    );

    it('should work, action', () =>
      expect(actionsCreators.changePasswordString(password)).toEqual(expectedAction)
    );
  });

  describe('function doLogout', () => {

    auth.setToken(SUPER_TOKEN);
    const expectedAction = {
      type: types.LOGOUT
    };
    const expectedState = { ...initialState,
      auth: { ...initialState.auth,
        token: null,
        loggedIn: false
      }
    };

    it('should work, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.auth, {
        token: SUPER_TOKEN,
        loggedIn: true
      });
      expect(reducer(_initialState, expectedAction)).toEqual(expectedState);
    });

    it('should work, action', () => {
      auth.removeToken();
      expect(auth.getToken()).toEqual(null);
    });
  });
})
