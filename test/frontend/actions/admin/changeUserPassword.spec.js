const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {translators, initialState, cloneState, getNotificationAction} = require('../../_shared.js');

const actions = require('../../../../app/actions/admin/changeUserPassword');
const types = require('../../../../app/actions/_constants');
const reducer = require('../../../../app/reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('admin/changeUserPassword actions', () => {
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

  describe('function setUserId', () => {
    const userId = translators[0].id;
    const expectedAction = {
      type: types.SET_ADMIN_USER_ID,
      id: userId
    };
    const expectedState = () => {
      let _expectedState = cloneState();
      _expectedState.admin.editUserPassword.id = userId;
      return _expectedState
    };

    // test types.SET_ADMIN_USER_ID
    it('should work, reducer', () =>
      expect(reducer(initialState, expectedAction)).toEqual(expectedState())
    );
    it('should work, action', () => expect(actions.setUserId(userId)).toEqual(expectedAction));
  });

  describe('function changeAdminUserPassword', () => {
    const testChangeAdminUserPassword = (obj) => {
      let _initialState = cloneState();
      Object.assign(_initialState.admin.editUserPassword, {
        password: 'new_password',
        confirmPassword: 'confirm_password'
      });
      let store = mockStore(_initialState);
      const expectedAction = {
        type: types.CHANGE_ADMIN_USER_PASSWORD,
        password: _initialState.admin.editUserPassword.password,
        confirmPassword: _initialState.admin.editUserPassword.confirmPassword
      };
      const key = Object.keys(obj)[0];
      expectedAction[key] = obj[key];

      it(`should change ${key}, reducer`, () => {
        let expectedState = cloneState(_initialState);
        expectedState.admin.editUserPassword[key] = obj[key];
        // test types.CHANGE_ADMIN_USER_PASSWORD
        expect(reducer(_initialState, expectedAction)).toEqual(expectedState);
      });
      it(`should change ${key}, action`, () => {
        store.dispatch(actions.changeAdminUserPassword(obj));
        expect(store.getActions()[0]).toEqual(expectedAction);
      });
    };

    testChangeAdminUserPassword({password: 'new_password_had_been_changed!'});
    testChangeAdminUserPassword({confirmPassword: 'confirmPassword_had_been_changed_too!'});
  });

  describe('function resetAdminUserPassword', () => {
    const expectedAction = {
      type: types.CHANGE_ADMIN_USER_PASSWORD,
      password: '',
      confirmPassword: ''
    };
    let _initialState = cloneState();
    Object.assign(_initialState.admin.editUserPassword, {
      password: 'password',
      confirmPassword: 'password'
    });

    it('should work, reducer', () =>
      // test types.CHANGE_ADMIN_USER_PASSWORD
      expect(reducer(_initialState, expectedAction)).toEqual(initialState)
    );
    it('should work, action', () => {
      let store = mockStore(_initialState);
      store.dispatch(actions.resetAdminUserPassword());
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  const createStateAfterRequestForUpdatePassword = (userId, error) => {
    let _initialState = cloneState();
    Object.assign(_initialState.admin.editUserPassword, {
      id: userId,
      error: error ? error : null,
      pending: false,
      password: '',
      confirmPassword: ''
    });
    return _initialState
  };

  const createStateBeforeRequestForUpdatePassword = (id, password, confirmPassword) => {
    let _state = cloneState();
    Object.assign(_state.admin.editUserPassword, {id, password, confirmPassword});
    return _state
  };

  describe('function updateAdminUserPasswordAsync', () => {
    const userId = translators[0].id;
    const password = 'new_password';
    const confirmPassword = 'confirm_new_password';
    const createInitialState = () => {
      let _initialState = cloneState();
      Object.assign(_initialState.admin.editUserPassword, {
        id: userId,
        password,
        confirmPassword
      })
      return _initialState
    };

    const createSuccessExpectedStateAfterRequest = () => {
      let _initialState = createInitialState();
      Object.assign(_initialState.admin.editUserPassword, {
        pending: false,
        error: null,
        password: '',
        confirmPassword: ''
      });
      return _initialState
    };
    const expectedSuccessResponse = {
      success: true,
      user: translators[0]
    };
    const expectedSuccessActions = () => ([
      { type: types.UPDATE_ADMIN_USER_PASSWORD_START },
      {
        type: types.UPDATE_ADMIN_USER_PASSWORD_END,
        error: null
      },
      getNotificationAction('EditUserPassword.new_password_success', null)
    ]);

    it('should work, reducer', () => {
      const actions = expectedSuccessActions();
      let _initialState = createInitialState();
      let expectedState = createInitialState();

      // test types.UPDATE_ADMIN_USER_PASSWORD_START
      expectedState.admin.editUserPassword.pending = true;
      expect(reducer(_initialState, actions[0])).toEqual(expectedState);
      // test types.UPDATE_ADMIN_USER_PASSWORD_END
      expectedState = createSuccessExpectedStateAfterRequest();
      expect(reducer(_initialState, actions[1])).toEqual(expectedState);
    });

    it('should work, action', () => {
      const expectedActions = expectedSuccessActions();
      let stateBeforeRequest = createInitialState();
      let store = mockStore(stateBeforeRequest);

      nock('http://localhost')
        .patch('/api/users/' + userId, {
          payload: {
            password: stateBeforeRequest.admin.editUserPassword.password,
            confirmPassword: stateBeforeRequest.admin.editUserPassword.confirmPassword
          }
        })
        .reply(200, expectedSuccessResponse);

      return store.dispatch(actions.updateAdminUserPasswordAsync()).then(() => {
        let successNotification = store.getActions().find(elem => elem.type === types.CREATE_NOTIFICATION);
        delete successNotification.notification.timer;
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t update user data. Database error'
    };
    const expectedErrorActions = () => ([
      { type: types.UPDATE_ADMIN_USER_PASSWORD_START },
      {
        type: types.UPDATE_ADMIN_USER_PASSWORD_END,
        error: expectedErrorResponse
      },
      getNotificationAction(null, expectedErrorResponse)
    ]);
    const createErrorExpectedState = () => {
      let _initialState = createInitialState();
      Object.assign(_initialState.admin.editUserPassword, {
        pending: false,
        error: expectedErrorResponse,
        password: '',
        confirmPassword: ''
      });
      return _initialState
    };

    it('should handle error, reducer', () => {
      const actions = expectedErrorActions();
      let _initialState = createInitialState();
      let expectedState = createInitialState();

      // test types.UPDATE_ADMIN_USER_PASSWORD_START
      expectedState.admin.editUserPassword.pending = true;
      expect(reducer(_initialState, actions[0])).toEqual(expectedState);
      // test types.UPDATE_ADMIN_USER_PASSWORD_END
      expectedState = createErrorExpectedState();
      expect(reducer(_initialState, actions[1])).toEqual(expectedState);
    });

    it('should handle error, action', () => {
      const expectedActions = expectedErrorActions();
      let stateBeforeRequest = createErrorExpectedState();
      let store = mockStore(stateBeforeRequest);

      nock('http://localhost')
        .patch('/api/users/' + userId, {
          payload: {
            password: stateBeforeRequest.admin.editUserPassword.password,
            confirmPassword: stateBeforeRequest.admin.editUserPassword.confirmPassword
          }
        })
        .reply(200, expectedErrorResponse);

      return store.dispatch(actions.updateAdminUserPasswordAsync()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
})
