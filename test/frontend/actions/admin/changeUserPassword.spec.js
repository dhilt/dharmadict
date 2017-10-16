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

  it('should work correctly: function setUserId', () => {
    const userId = translators[0].id;
    const expectedAction = {
      type: types.SET_ADMIN_USER_ID,
      id: userId
    };
    let expectedState = cloneState();
    expectedState.admin.editUserPassword.id = userId;

    // test types.SET_ADMIN_USER_ID
    expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    // test action
    expect(actions.setUserId(userId)).toEqual(expectedAction);
  });

  it('should work correctly: function changeAdminUserPassword', () => {
    const password = 'new_password';
    const confirmPassword = 'confirm_password';
    let _initialState = cloneState();
    _initialState.admin.editUserPassword.password = password;
    _initialState.admin.editUserPassword.confirmPassword = confirmPassword;
    let store = mockStore(_initialState);
    const expectedActionWithPassword = {
      type: types.CHANGE_ADMIN_USER_PASSWORD,
      password,
      confirmPassword: store.getState().admin.editUserPassword.confirmPassword
    };
    const expectedActionWithConfirmPassword = {
      type: types.CHANGE_ADMIN_USER_PASSWORD,
      password: store.getState().admin.editUserPassword.password,
      confirmPassword
    };

    // test types.CHANGE_ADMIN_USER_PASSWORD with property - password
    let expectedState = cloneState(_initialState);
    expectedState.admin.editUserPassword.password = password;
    expect(reducer(initialState, expectedActionWithPassword)).toEqual(expectedState);

    // test types.CHANGE_ADMIN_USER_PASSWORD with property - confirmPassword
    expectedState.admin.editUserPassword.confirmPassword = confirmPassword;
    expect(reducer(initialState, expectedActionWithConfirmPassword)).toEqual(expectedState);

    // test actions
    store.dispatch(actions.changeAdminUserPassword({password: password}));
    expect(store.getActions()[0]).toEqual(expectedActionWithPassword);
    store.dispatch(actions.changeAdminUserPassword({confirmPassword: confirmPassword}));
    expect(store.getActions()[1]).toEqual(expectedActionWithConfirmPassword);
  });

  it('should work correctly: function resetAdminUserPassword', () => {
    const expectedAction = {
      type: types.CHANGE_ADMIN_USER_PASSWORD,
      password: '',
      confirmPassword: ''
    };

    // test types.CHANGE_ADMIN_USER_PASSWORD
    let expectedState = cloneState();
    let _initialState = cloneState();
    _initialState.admin.editUserPassword.password = 'password';
    _initialState.admin.editUserPassword.confirmPassword = 'password';
    expect(reducer(_initialState, expectedAction)).toEqual(expectedState);

    // test action
    let store = mockStore(_initialState);
    store.dispatch(actions.resetAdminUserPassword());
    expect(store.getActions()[0]).toEqual(expectedAction);
  });

  it('should work correctly: function updateAdminUserPasswordAsync', () => {
    const userId = translators[0].id;
    const password = 'new_password';
    const confirmPassword = 'new_password';
    const expectedSuccessResponse = {
      success: true,
      user: translators[0]
    };
    const expectedSuccessActions = [
      { type: types.UPDATE_ADMIN_USER_PASSWORD_START },
      {
        type: types.UPDATE_ADMIN_USER_PASSWORD_END,
        error: null,
        result: true
      },
      getNotificationAction('EditUserPassword.new_password_success', null)
    ];

    // test types.UPDATE_ADMIN_USER_PASSWORD_START
    let expectedState = cloneState();
    expectedState.admin.editUserPassword.pending = true;
    expectedState.admin.editUserPassword.error = null;
    expect(reducer(initialState, expectedSuccessActions[0])).toEqual(expectedState);

    // test types.UPDATE_ADMIN_USER_PASSWORD_END
    expectedState = cloneState();
    let _initialState = cloneState();
    _initialState.admin.editUserPassword.id = userId;
    _initialState.admin.editUserPassword.password = password;
    _initialState.admin.editUserPassword.confirmPassword = confirmPassword;
    expectedState.admin.editUserPassword.id = userId;
    expectedState.admin.editUserPassword.error = null;
    expectedState.admin.editUserPassword.pending = false;
    expectedState.admin.editUserPassword.password = '';
    expectedState.admin.editUserPassword.confirmPassword = '';
    expect(reducer(_initialState, expectedSuccessActions[1])).toEqual(expectedState);

    // test async actions
    let expectedStateBeforeRequest = cloneState();
    expectedStateBeforeRequest.admin.editUserPassword.id = userId;
    expectedStateBeforeRequest.admin.editUserPassword.password = password;
    expectedStateBeforeRequest.admin.editUserPassword.confirmPassword = confirmPassword;
    let store = mockStore(expectedStateBeforeRequest);

    nock('http://localhost')
      .patch('/api/users/' + userId, {
        payload: {
          password: store.getState().admin.editUserPassword.password,
          confirmPassword: store.getState().admin.editUserPassword.confirmPassword
        }
      })
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.updateAdminUserPasswordAsync()).then(() => {
      let successNotification = store.getActions().find(elem => elem.type === types.CREATE_NOTIFICATION);
      delete successNotification.notification.timer;
      expect(store.getActions()).toEqual(expectedSuccessActions);
    });
  });

  it('should handle error correctly: function updateAdminUserPasswordAsync', () => {
    const userId = translators[0].id;
    const password = 'new_password';
    const confirmPassword = 'new_password';
    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t update user data. Database error'
    };
    const expectedErrorActions = [
      { type: types.UPDATE_ADMIN_USER_PASSWORD_START },
      {
        type: types.UPDATE_ADMIN_USER_PASSWORD_END,
        error: expectedErrorResponse,
        result: false
      },
      getNotificationAction(null, expectedErrorResponse)
    ];

    // test types.UPDATE_ADMIN_USER_PASSWORD_START
    let expectedState = cloneState();
    expectedState.admin.editUserPassword.pending = true;
    expectedState.admin.editUserPassword.error = null;
    expect(reducer(initialState, expectedErrorActions[0])).toEqual(expectedState);

    // test types.UPDATE_ADMIN_USER_PASSWORD_END
    expectedState = cloneState();
    let _initialState = cloneState();
    _initialState.admin.editUserPassword.id = userId;
    _initialState.admin.editUserPassword.password = password;
    _initialState.admin.editUserPassword.confirmPassword = confirmPassword;
    expectedState.admin.editUserPassword.id = userId;
    expectedState.admin.editUserPassword.pending = false;
    expectedState.admin.editUserPassword.password = '';
    expectedState.admin.editUserPassword.confirmPassword = '';
    expectedState.admin.editUserPassword.error = expectedErrorResponse;
    expect(reducer(_initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    let expectedStateBeforeRequest = cloneState();
    expectedStateBeforeRequest.admin.editUserPassword.id = userId;
    expectedStateBeforeRequest.admin.editUserPassword.password = password;
    expectedStateBeforeRequest.admin.editUserPassword.confirmPassword = confirmPassword;
    let store = mockStore(expectedStateBeforeRequest);

    nock('http://localhost/')
      .patch('/api/users/' + userId, {
        payload: {
          password: store.getState().admin.editUserPassword.password,
          confirmPassword: store.getState().admin.editUserPassword.confirmPassword
        }
      })
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.updateAdminUserPasswordAsync())
      .then(() => expect(store.getActions()).toEqual(expectedErrorActions));
  });
})
