const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {translators} = require('../../_shared.js');

const actions = require('../../../../app/actions/admin/changeUserPassword');
const types = require('../../../../app/actions/_constants');
const reducer = require('../../../../app/reducers').default;
const initialState = require('../../../../app/reducers/_initial').default;
const lang = require('../../../../app/helpers/lang').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('common actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
    console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should work correctly: function setUserId', () => {
    const userId = translators[0].id;
    const expectedAction = {
      type: types.SET_ADMIN_USER_ID,
      id: userId
    };
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.editUserPassword.id = userId;

    // test reducers
    expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    // test actions
    expect(actions.setUserId(userId)).toEqual(expectedAction);
  });

  it('should work correctly: function changeAdminUserPassword', () => {
    const password = 'new_password';
    const confirmPassword = 'new_password';
    let store = mockStore(initialState);
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

    // test reducers
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.editUserPassword.password = password;
    expect(reducer(initialState, expectedActionWithPassword)).toEqual(expectedState);

    expectedState = JSON.parse(JSON.stringify(initialState));
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

    // test reducers
    let expectedState = JSON.parse(JSON.stringify(initialState));
    let storeState = JSON.parse(JSON.stringify(initialState));
    storeState.admin.editUserPassword.password = 'password';
    storeState.admin.editUserPassword.confirmPassword = 'password';
    expect(reducer(storeState, expectedAction)).toEqual(expectedState);

    // test actions
    let store = mockStore(initialState);
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
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: 'EditUserPassword.new_password_success',
          ttl: 3000,
          type: 'success',
          values: {}
        }
      }
    ];

    // test reducers
    let expectedState = JSON.parse(JSON.stringify(initialState));
    let changedInitialState = JSON.parse(JSON.stringify(initialState));
    changedInitialState.admin.editUserPassword.password = password;
    changedInitialState.admin.editUserPassword.confirmPassword = confirmPassword;
    expectedState.admin.editUserPassword.password = '';
    expectedState.admin.editUserPassword.confirmPassword = '';
    expect(reducer(changedInitialState, expectedSuccessActions[1])).toEqual(expectedState);

    // does not work yet
    // // test async actions
    // let store = mockStore(initialState);
    // store.dispatch(actions.setUserId(userId));
    // store.dispatch(actions.changeAdminUserPassword({password: password}));
    // store.dispatch(actions.changeAdminUserPassword({confirmPassword: confirmPassword}));
    //
    // nock('http://localhost/')
    //   .patch('/api/users/' + userId, {
    //     payload: {
    //       password: store.getState().admin.editUserPassword.password,
    //       confirmPassword: store.getState().admin.editUserPassword.confirmPassword
    //     }
    //   })
    //   .reply(200, expectedSuccessResponse);
    //
    // return store.dispatch(actions.updateAdminUserPasswordAsync()).then(() => {
    //   expect(store.getActions()).toEqual(expectedSuccessActions);
    // });
  });

  it('should handle error correctly: function updateAdminUserPasswordAsync', () => {
    const userId = translators[0].id;
    const password = 'new_password';
    const confirmPassword = 'new_password';
    const expectedErrorResponse = {
      success: true,
      user: {
        id: translators[0].id
      }
    };
    const expectedErrorActions = [
      { type: types.UPDATE_ADMIN_USER_PASSWORD_START },
      {
        type: types.UPDATE_ADMIN_USER_PASSWORD_END,
        error: 'Can\'t update user data. Database error',
        result: false
      },
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: 'Can\'t update user data. Database error',
          ttl: -1,
          type: 'danger',
          values: {}
        }
      }
    ];

    // test reducers
    let expectedState = JSON.parse(JSON.stringify(initialState));
    let changedInitialState = JSON.parse(JSON.stringify(initialState));
    changedInitialState.admin.editUserPassword.password = password;
    changedInitialState.admin.editUserPassword.confirmPassword = confirmPassword;
    expectedState.admin.editUserPassword.password = '';
    expectedState.admin.editUserPassword.confirmPassword = '';
    expectedState.admin.editUserPassword.error = 'Can\'t update user data. Database error';
    expect(reducer(changedInitialState, expectedErrorActions[1])).toEqual(expectedState);

    // does not work yet
    // // test async actions
    // let store = mockStore(initialState);
    // store.dispatch(actions.setUserId(userId));
    // store.dispatch(actions.changeAdminUserPassword({password: password}));
    // store.dispatch(actions.changeAdminUserPassword({confirmPassword: confirmPassword}));
    //
    // nock('http://localhost/')
    //   .patch('/api/users/' + userId, {
    //     payload: {
    //       password: store.getState().admin.editUserPassword.password,
    //       confirmPassword: store.getState().admin.editUserPassword.confirmPassword
    //     }
    //   })
    //   .reply(500, expectedErrorResponse);
    //
    // return store.dispatch(actions.updateAdminUserPasswordAsync()).then(() => {
    //   expect(store.getActions()).toEqual(expectedErrorActions);
    // });
  });
})
