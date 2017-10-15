const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {translators} = require('../../_shared.js');

const actions = require('../../../../app/actions/admin/changeUser');
const types = require('../../../../app/actions/_constants');
const reducer = require('../../../../app/reducers').default;
const initialState = require('../../../../app/reducers/_initial').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

/* from actions/admin/changeUser.js */
const getEditableUserDataObject = (user) => ({
  name: user.name,
  language: user.language,
  description: user.description
});

describe('common actions', () => {
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
    expect(reducer(undefined, {})).toEqual(initialState);
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
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.editUser.sourcePending = true;
    expectedState.admin.editUser.error = null;
    expect(reducer(initialState, expectedSuccessActions[0])).toEqual(expectedState);

    // test types.GET_ADMIN_USER_DATA_END
    expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.editUser.error = null;
    expectedState.admin.editUser.id = user.id;
    expectedState.admin.editUser.sourcePending = false;
    expectedState.admin.editUser.data = getEditableUserDataObject(expectedSuccessResponse.user);
    expectedState.admin.editUser.dataSource = getEditableUserDataObject(expectedSuccessResponse.user);
    expect(reducer(initialState, expectedSuccessActions[1])).toEqual(expectedState);

    // test async actions
    let expectedStateBeforeRequest = JSON.parse(JSON.stringify(initialState));
    expectedStateBeforeRequest.admin.editUser.id = user.id;
    expectedStateBeforeRequest.admin.editUser.dataSource = getEditableUserDataObject(user);
    let store = mockStore(expectedStateBeforeRequest);

    nock('http://localhost')
      .get('/api/users/' + user.id)
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.getAdminUserDataAsync(user.id)).then(() => {
      expect(store.getActions()).toEqual(expectedSuccessActions);
    });
  });

  it('should handle error correctly: function getAdminUserDataAsync', () => {
    const user = translators[0];
    let expectedStateBeforeRequest = JSON.parse(JSON.stringify(initialState));
    expectedStateBeforeRequest.admin.editUser.id = user.id;
    expectedStateBeforeRequest.admin.editUser.dataSource = getEditableUserDataObject(user);
    expectedStateBeforeRequest.admin.editUser.data = getEditableUserDataObject(user);
    expectedStateBeforeRequest.admin.editUser.data.description = 'New description!';
    // function should take data about user from own redux-store
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
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.editUser.sourcePending = true;
    expectedState.admin.editUser.error = null;
    expect(reducer(initialState, expectedErrorActions[0])).toEqual(expectedState);

    // test types.GET_ADMIN_USER_DATA_END
    expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.editUser.error = expectedErrorResponse;
    expectedState.admin.editUser.id = user.id;
    expectedState.admin.editUser.sourcePending = false;
    expectedState.admin.editUser.data = getEditableUserDataObject(user);
    expectedState.admin.editUser.dataSource = getEditableUserDataObject(user);
    expect(reducer(initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    nock('http://localhost')
      .get('/api/users/' + user.id)
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.getAdminUserDataAsync(user.id)).then(() => {
      expect(store.getActions()).toEqual(expectedErrorActions);
    });
  });

  it('should work correctly: function changeAdminUserData', () => {
    const user = translators[0];
    const new_name = 'new name of user';
    const new_language = 'en';  // The correctness of the language selection is checked on the server
    const new_description = 'new description of user';

    let _initialState = JSON.parse(JSON.stringify(initialState));
    let expectedPayload = getEditableUserDataObject(user);
    _initialState.admin.editUser.dataSource = getEditableUserDataObject(user);
    _initialState.admin.editUser.data = getEditableUserDataObject(user);
    let expectedState = JSON.parse(JSON.stringify(_initialState));

    // test types.CHANGE_ADMIN_USER_DATA with property - name
    expectedPayload.name = new_name;
    let expectedAction = {
      type: types.CHANGE_ADMIN_USER_DATA,
      payload: expectedPayload,
    };
    expectedState.admin.editUser.data.name = new_name;
    expect(reducer(_initialState, expectedAction)).toEqual(expectedState);

    // test types.CHANGE_ADMIN_USER_DATA with property - description
    expectedPayload.description = new_description;
    expectedAction = {
      type: types.CHANGE_ADMIN_USER_DATA,
      payload: expectedPayload
    };
    expectedState.admin.editUser.data.description = new_description;
    expect(reducer(_initialState, expectedAction)).toEqual(expectedState);

    // test types.CHANGE_ADMIN_USER_DATA with property - language
    expectedPayload.language = new_language;
    expectedAction = {
      type: types.CHANGE_ADMIN_USER_DATA,
      payload: expectedPayload
    };
    expectedState.admin.editUser.data.language = new_language;
    expect(reducer(_initialState, expectedAction)).toEqual(expectedState);
  });

  it('should work correctly: function updateAdminUserDataAsync', () => {
    const user = translators[0];
    const expectedSuccessResponse = {
      success: true,
      user: {
        name: 'New name of user/translator',
        language: user.language,
        description: user.description
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

    let _initialState = JSON.parse(JSON.stringify(initialState));
    _initialState.admin.editUser.id = user.id;
    _initialState.admin.editUser.dataSource = getEditableUserDataObject(user);
    _initialState.admin.editUser.data = getEditableUserDataObject(user);
    // below string should be in 'data' and 'dataSource'
    _initialState.admin.editUser.data.name = expectedSuccessResponse.user.name;

    // test types.UPDATE_ADMIN_USER_DATA_START
    let expectedState = JSON.parse(JSON.stringify(_initialState));
    expectedState.admin.editUser.pending = true;
    expect(reducer(_initialState, expectedSuccessActions[0])).toEqual(expectedState);

    // test types.UPDATE_ADMIN_USER_DATA_END
    expectedState = JSON.parse(JSON.stringify(_initialState));
    expectedState.admin.editUser.pending = false;
    expectedState.admin.editUser.error = null;
    expectedState.admin.editUser.dataSource.name = expectedSuccessResponse.user.name;
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
    let _initialState = JSON.parse(JSON.stringify(initialState));
    _initialState.admin.editUser.id = user.id;
    _initialState.admin.editUser.dataSource = getEditableUserDataObject(user);
    _initialState.admin.editUser.data = getEditableUserDataObject(user);
    _initialState.admin.editUser.data.name = 'New name of user/translator';
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
    let expectedState = JSON.parse(JSON.stringify(_initialState));
    expectedState.admin.editUser.pending = true;
    expect(reducer(_initialState, expectedErrorActions[0])).toEqual(expectedState);

    // test types.UPDATE_ADMIN_USER_DATA_END
    expectedState = JSON.parse(JSON.stringify(_initialState));
    expectedState.admin.editUser.pending = false;
    expectedState.admin.editUser.error = expectedErrorResponse;
    expectedState.admin.editUser.dataSource = store.getState().admin.editUser.dataSource;
    expect(reducer(_initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    nock('http://localhost')
      .patch('/api/users/' + user.id, {
        payload: store.getState().admin.editUser.data
      })
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.updateAdminUserDataAsync()).then(() => {
      expect(store.getActions()).toEqual(expectedErrorActions);
    });
  });

  it('should work correctly: function resetAdminUserData', () => {
    const user = translators[0];
    let _initialState = JSON.parse(JSON.stringify(initialState));
    _initialState.admin.editSource = getEditableUserDataObject(user);
    _initialState.admin.data = getEditableUserDataObject(user);
    let expectedState = JSON.parse(JSON.stringify(_initialState));

    _initialState.admin.editUser.data.name = 'New name!';
    _initialState.admin.editUser.data.description = 'New description';
    let store = mockStore(_initialState);

    // test types.CHANGE_ADMIN_USER_DATA
    const expectedAction = {
      type: types.CHANGE_ADMIN_USER_DATA,
      payload: store.getState().admin.editUser.dataSource
    };
    expect(reducer(_initialState, expectedAction)).toEqual(expectedState);
  });
})
