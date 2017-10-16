const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {translators} = require('../../_shared.js');
const initialState = require('../../_shared.js').initialState.get();
const cloneInitialState = require('../../_shared.js').initialState.clone;

const actions = require('../../../../app/actions/admin/changeUser');
const types = require('../../../../app/actions/_constants');
const reducer = require('../../../../app/reducers').default;
const {getEditableUserDataObject} = require('../../../../app/actions/admin/changeUser');

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('admin/changeUser actions', () => {
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

  it('should work correctly: function getAdminUserDataAsync', () => {
    const user = translators[0];
    const expectedSuccessResponse = {
      success: true,
      user
    };
    const expectedSuccessActions = [
      { type: types.GET_ADMIN_USER_DATA_START },
      {
        type: types.GET_ADMIN_USER_DATA_END,
        error: null,
        data: getEditableUserDataObject(expectedSuccessResponse.user),
        id: expectedSuccessResponse.user.id
      }
    ];

    // test types.GET_ADMIN_USER_DATA_START
    let expectedState = cloneInitialState();
    Object.assign(expectedState.admin.editUser, {
      sourcePending: true,
      error: null
    });
    expect(reducer(initialState, expectedSuccessActions[0])).toEqual(expectedState);

    // test types.GET_ADMIN_USER_DATA_END
    expectedState = cloneInitialState();
    Object.assign(expectedState.admin.editUser, {
      error: null,
      id: user.id,
      sourcePending: false,
      data: getEditableUserDataObject(expectedSuccessResponse.user),
      dataSource: getEditableUserDataObject(expectedSuccessResponse.user)
    });
    expect(reducer(initialState, expectedSuccessActions[1])).toEqual(expectedState);

    // test async actions
    let expectedStateBeforeRequest = cloneInitialState();
    Object.assign(expectedStateBeforeRequest.admin.editUser, {
      id: user.id,
      dataSource: getEditableUserDataObject(expectedSuccessResponse.user)
    });
    let store = mockStore(expectedStateBeforeRequest);

    nock('http://localhost')
      .get('/api/users/' + user.id)
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.getAdminUserDataAsync(user.id))
      .then(() => expect(store.getActions()).toEqual(expectedSuccessActions));
  });

  it('should handle error correctly: function getAdminUserDataAsync', () => {
    const user = translators[0];
    let expectedStateBeforeRequest = cloneInitialState();
    Object.assign(expectedStateBeforeRequest.admin.editUser, {
      id: user.id,
      dataSource: getEditableUserDataObject(user),
      // function should take data about user from own redux-store
      data: Object.assign(getEditableUserDataObject(user), {description: 'New description'})
    });
    let store = mockStore(expectedStateBeforeRequest);

    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t find user. Database error'
    };
    const expectedErrorActions = [
      { type: types.GET_ADMIN_USER_DATA_START },
      {
        type: types.GET_ADMIN_USER_DATA_END,
        error: expectedErrorResponse,
        data: store.getState().admin.editUser.dataSource,
        id: store.getState().admin.editUser.id
      },
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: expectedErrorResponse.message,
          ttl: -1,
          type: 'danger',
          values: {}
        }
      }
    ];

    // test types.GET_ADMIN_USER_DATA_START
    let expectedState = cloneInitialState();
    Object.assign(expectedState.admin.editUser, {
      sourcePending: true,
      error: null
    });
    expect(reducer(initialState, expectedErrorActions[0])).toEqual(expectedState);

    // test types.GET_ADMIN_USER_DATA_END
    expectedState = cloneInitialState();
    Object.assign(expectedState.admin.editUser, {
      error: expectedErrorResponse,
      id: user.id,
      sourcePending: false,
      data: getEditableUserDataObject(user),
      dataSource: getEditableUserDataObject(user)
    });
    expect(reducer(expectedStateBeforeRequest, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    nock('http://localhost')
      .get('/api/users/' + user.id)
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.getAdminUserDataAsync(user.id))
      .then(() => expect(store.getActions()).toEqual(expectedErrorActions));
  });

  const testChangeAdminUserData = (obj) => {
    const user = translators[0];
    const property = Object.keys(obj)[0];
    const value = obj[property];
    let _initialState = cloneInitialState();
    Object.assign(_initialState.admin.editUser, {
      data: getEditableUserDataObject(user),
      dataSource: getEditableUserDataObject(user)
    });
    let expectedState = cloneInitialState(_initialState);
    Object.assign(expectedState.admin.editUser.data, {
      [property]: value
    });
    let store = mockStore(_initialState);
    const expectedAction = {
      type: types.CHANGE_ADMIN_USER_DATA,
      payload: expectedState.admin.editUser.data
    };

    // test types.CHANGE_ADMIN_USER_DATA
    expect(reducer(_initialState, expectedAction)).toEqual(expectedState);
    // test action
    store.dispatch(actions.changeAdminUserData(obj));
    expect(store.getActions()[0]).toEqual(expectedAction);
  };

  it('should change name correctly: function changeAdminUserData', () =>
    testChangeAdminUserData({name: 'new name of user/translator'})
  );

  it('should change language correctly: function changeAdminUserData', () =>
    testChangeAdminUserData({language: 'new language of user/translator'})
  );

  it('should change description correctly: function changeAdminUserData', () =>
    testChangeAdminUserData({description: 'new description of user/translator'})
  );

  it('should work correctly: function updateAdminUserDataAsync', () => {
    const user = translators[0];
    const expectedSuccessResponse = {
      success: true,
      user: {...user,
        name: 'New name of user/translator'
      }
    };
    const expectedSuccessActions = [
      { type: types.UPDATE_ADMIN_USER_DATA_START },
      {
        type: types.UPDATE_ADMIN_USER_DATA_END,
        error: null,
        data: getEditableUserDataObject(expectedSuccessResponse.user)
      },
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: 'EditUser.success',
          ttl: 3000,
          type: 'success',
          values: {}
        }
      }
    ];

    let _initialState = cloneInitialState();
    Object.assign(_initialState.admin.editUser, {
      id: user.id,
      dataSource: getEditableUserDataObject(user),
      data: getEditableUserDataObject(expectedSuccessResponse.user)
    });

    // test types.UPDATE_ADMIN_USER_DATA_START
    let expectedState = cloneInitialState(_initialState);
    Object.assign(expectedState.admin.editUser, {
      pending: true
    });
    expect(reducer(_initialState, expectedSuccessActions[0])).toEqual(expectedState);

    // test types.UPDATE_ADMIN_USER_DATA_END
    expectedState = cloneInitialState(_initialState);
    Object.assign(expectedState.admin.editUser, {
      pending: false,
      error: null,
      dataSource: {...expectedState.admin.editUser.dataSource,
        name: expectedSuccessResponse.user.name
      }
    });
    expect(reducer(_initialState, expectedSuccessActions[1])).toEqual(expectedState);

    // test async actions
    let store = mockStore(_initialState);

    nock('http://localhost')
      .patch('/api/users/' + user.id, {
        payload: store.getState().admin.editUser.data
      })
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.updateAdminUserDataAsync()).then(() => {
      let successNotification = store.getActions().find(elem => elem.type === types.CREATE_NOTIFICATION);
      delete successNotification.notification.timer;
      expect(store.getActions()).toEqual(expectedSuccessActions);
    });
  });

  it('should handle error correctly: function updateAdminUserDataAsync', () => {
    const user = translators[0];
    let _initialState = cloneInitialState();
    Object.assign(_initialState.admin.editUser, {
      id: user.id,
      dataSource: getEditableUserDataObject(user),
      data: Object.assign(getEditableUserDataObject(user), {name: 'New name of user/translator'}),
    });
    let store = mockStore(_initialState);

    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t update user data. Database error'
    };
    const expectedErrorActions = [
      { type: types.UPDATE_ADMIN_USER_DATA_START },
      {
        type: types.UPDATE_ADMIN_USER_DATA_END,
        error: expectedErrorResponse,
        data: store.getState().admin.editUser.dataSource
      },
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: expectedErrorResponse.message,
          ttl: -1,
          type: 'danger',
          values: {}
        }
      }
    ];

    // test types.UPDATE_ADMIN_USER_DATA_START
    let expectedState = cloneInitialState(_initialState);
    Object.assign(expectedState.admin.editUser, {
      pending: true
    });
    expect(reducer(_initialState, expectedErrorActions[0])).toEqual(expectedState);

    // test types.UPDATE_ADMIN_USER_DATA_END
    expectedState = cloneInitialState(_initialState);
    Object.assign(expectedState.admin.editUser, {
      pending: false,
      error: expectedErrorResponse,
      dataSource: store.getState().admin.editUser.dataSource
    });
    expect(reducer(_initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    nock('http://localhost')
      .patch('/api/users/' + user.id, {
        payload: store.getState().admin.editUser.data
      })
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.updateAdminUserDataAsync())
      .then(() => expect(store.getActions()).toEqual(expectedErrorActions));
  });

  it('should work correctly: function resetAdminUserData', () => {
    const user = translators[0];
    let _initialState = cloneInitialState();
    Object.assign(_initialState.admin.editUser, {
      dataSource: getEditableUserDataObject(user),
      data: getEditableUserDataObject(user)
    });
    let expectedState = cloneInitialState(_initialState);

    Object.assign(_initialState.admin.editUser.data, {
      name: 'New name!',
      description: 'New description'
    });
    let store = mockStore(_initialState);

    // test types.CHANGE_ADMIN_USER_DATA
    const expectedAction = {
      type: types.CHANGE_ADMIN_USER_DATA,
      payload: store.getState().admin.editUser.dataSource
    };
    expect(reducer(_initialState, expectedAction)).toEqual(expectedState);

    // test action
    store.dispatch(actions.resetAdminUserData());
    expect(store.getActions()[0]).toEqual(expectedAction);
  });
})
