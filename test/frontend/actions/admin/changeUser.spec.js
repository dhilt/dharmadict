const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, translators, getNotificationAction} = require('../../_shared.js');

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

  describe('function getAdminUserDataAsync', () => {
    // if function getAdminUserDataAsync was successfull, 'dataSource' should be rewrited by 'data'.
    // in another case, 'data' should be rewrited by 'dataSource'
    const user = translators[0];
    let changedUser = user;
    changedUser.name = 'Name of user was changed...';
    const expectedSuccessResponse = {
      success: true,
      user: changedUser
    };
    const expectedSuccessActions = () => ([
      { type: types.GET_ADMIN_USER_DATA_START },
      {
        type: types.GET_ADMIN_USER_DATA_END,
        error: null,
        data: getEditableUserDataObject(changedUser),
        id: changedUser.id
      }
    ]);
    const createSuccessExpectedState = () => {
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        error: null,
        id: user.id,
        sourcePending: false,
        data: getEditableUserDataObject(changedUser),
        dataSource: getEditableUserDataObject(changedUser)
      });
      return expectedState
    };

    it('should work, reducer', () => {
      const actions = expectedSuccessActions();

      // test types.GET_ADMIN_USER_DATA_START
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        sourcePending: true,
        error: null
      });
      expect(reducer(initialState, actions[0])).toEqual(expectedState);

      // test types.GET_ADMIN_USER_DATA_END
      expectedState = createSuccessExpectedState();
      expect(reducer(initialState, actions[1])).toEqual(expectedState);
    });

    it('should work, action', () => {
      const expectedActions = expectedSuccessActions();

      let expectedStateBeforeRequest = cloneState();
      Object.assign(expectedStateBeforeRequest.admin.editUser, {
        id: user.id,
        data: getEditableUserDataObject(user),
        dataSource: getEditableUserDataObject(user)
      });
      let store = mockStore(expectedStateBeforeRequest);

      nock('http://localhost')
        .get('/api/users/' + user.id)
        .reply(200, expectedSuccessResponse);

      return store.dispatch(actions.getAdminUserDataAsync(user.id))
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t find user. Database error'
    };
    const expectedErrorActions = () => ([
      { type: types.GET_ADMIN_USER_DATA_START },
      {
        type: types.GET_ADMIN_USER_DATA_END,
        error: expectedErrorResponse,
        data: getEditableUserDataObject(user),
        id: user.id
      },
      getNotificationAction(null, expectedErrorResponse)
    ]);
    const createErrorExpectedState = () => {
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        error: expectedErrorResponse,
        id: user.id,
        sourcePending: false,
        data: getEditableUserDataObject(user),
        dataSource: getEditableUserDataObject(user)
      });
      return expectedState
    };

    it('should handle error, reducer', () => {
      const actions = expectedErrorActions();

      // test types.GET_ADMIN_USER_DATA_START
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        sourcePending: true,
        error: null
      });
      expect(reducer(initialState, actions[0])).toEqual(expectedState);

      // test types.GET_ADMIN_USER_DATA_END
      expectedState = createErrorExpectedState();
      expect(reducer(initialState, actions[1])).toEqual(expectedState);
    });

    it('should handle error, action', () => {
      let expectedStateBeforeRequest = cloneState();
      Object.assign(expectedStateBeforeRequest.admin.editUser, {
        id: user.id,
        data: getEditableUserDataObject(changedUser),
        dataSource: getEditableUserDataObject(user)
      });
      let store = mockStore(expectedStateBeforeRequest);

      nock('http://localhost')
        .get('/api/users/' + user.id)
        .reply(200, expectedErrorResponse);

      const expectedActions = expectedErrorActions();
      return store.dispatch(actions.getAdminUserDataAsync(user.id))
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
  });

  describe('function changeAdminUserData', () => {

    const testChangeAdminUserData = (obj) => {
      const user = translators[0];
      const property = Object.keys(obj)[0];
      const value = obj[property];
      let _initialState = cloneState();
      Object.assign(_initialState.admin.editUser, {
        data: getEditableUserDataObject(user),
        dataSource: getEditableUserDataObject(user)
      });
      let expectedState = cloneState(_initialState);
      Object.assign(expectedState.admin.editUser.data, {
        [property]: value
      });
      let store = mockStore(_initialState);
      const expectedAction = {
        type: types.CHANGE_ADMIN_USER_DATA,
        payload: expectedState.admin.editUser.data
      };
      it('should change ${property}, reducer', () =>
        // test types.CHANGE_ADMIN_USER_DATA
        expect(reducer(_initialState, expectedAction)).toEqual(expectedState)
      );
      it('should change ${property}, action', () => {
        store.dispatch(actions.changeAdminUserData(obj));
        expect(store.getActions()[0]).toEqual(expectedAction);
      });
    };

    testChangeAdminUserData({name: 'new name of user/translator'});
    testChangeAdminUserData({language: 'new language of user/translator'});
    testChangeAdminUserData({description: 'new description of user/translator'});
  });

  describe('function updateAdminUserDataAsync', () => {

    const user = translators[0];
    let changedUser = translators[0];
    changedUser.name = 'New name of user/translator'
    const createInitialState = () => {
      let _initialState = cloneState();
      Object.assign(_initialState.admin.editUser, {
        id: user.id,
        dataSource: getEditableUserDataObject(user),
        data: getEditableUserDataObject(changedUser)
      });
      return _initialState
    };

    const expectedSuccessResponse = {
      success: true,
      user: changedUser
    };
    const expectedSuccessActions = () => ([
      { type: types.UPDATE_ADMIN_USER_DATA_START },
      {
        type: types.UPDATE_ADMIN_USER_DATA_END,
        error: null,
        data: getEditableUserDataObject(changedUser)
      },
      getNotificationAction('EditUser.success', null)
    ]);
    const createSuccessExpectedState = () => {
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        error: null,
        id: user.id,
        pending: false,
        data: getEditableUserDataObject(changedUser),
        dataSource: getEditableUserDataObject(changedUser)
      });
      return expectedState
    };

    it('should work, reducer', () => {
      const actions = expectedSuccessActions();

      // test types.UPDATE_ADMIN_USER_DATA_START
      let _initialState = createInitialState();
      let expectedState = createSuccessExpectedState();
      Object.assign(expectedState.admin.editUser, {
        pending: true,
        error: null
      });
      expect(reducer(_initialState, actions[0])).toEqual(expectedState);

      // test types.UPDATE_ADMIN_USER_DATA_END
      expectedState = createSuccessExpectedState();
      expect(reducer(_initialState, actions[1])).toEqual(expectedState);
    });

    it('should work, action', () => {
      const expectedActions = expectedSuccessActions();

      let expectedStateBeforeRequest = createSuccessExpectedState();
      let store = mockStore(expectedStateBeforeRequest);

      nock('http://localhost')
        .patch('/api/users/' + user.id, {payload: expectedStateBeforeRequest.admin.editUser.data})
        .reply(200, expectedSuccessResponse);

      return store.dispatch(actions.updateAdminUserDataAsync()).then(() => {
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
      { type: types.UPDATE_ADMIN_USER_DATA_START },
      {
        type: types.UPDATE_ADMIN_USER_DATA_END,
        error: expectedErrorResponse,
        data: getEditableUserDataObject(user)
      },
      getNotificationAction(null, expectedErrorResponse)
    ]);
    const createErrorExpectedState = () => {
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        error: expectedErrorResponse,
        id: user.id,
        pending: false,
        data: getEditableUserDataObject(changedUser),
        dataSource: getEditableUserDataObject(user)
      });
      return expectedState
    };

    it('should handle error, reducer', () => {
      const actions = expectedErrorActions();

      // test types.UPDATE_ADMIN_USER_DATA_START
      let _initialState = createInitialState();
      let expectedState = createErrorExpectedState();
      Object.assign(expectedState.admin.editUser, {
        pending: true,
        error: null
      });
      expect(reducer(_initialState, actions[0])).toEqual(expectedState);

      // test types.UPDATE_ADMIN_USER_DATA_END
      expectedState = createErrorExpectedState();
      expect(reducer(_initialState, actions[1])).toEqual(expectedState);
    });

    it('should handle error, action', () => {
      let expectedStateBeforeRequest = cloneState();
      Object.assign(expectedStateBeforeRequest.admin.editUser, {
        id: user.id,
        data: getEditableUserDataObject(changedUser),
        dataSource: getEditableUserDataObject(user)
      });
      let store = mockStore(expectedStateBeforeRequest);

      nock('http://localhost')
        .patch('/api/users/' + user.id, {payload: expectedStateBeforeRequest.admin.editUser.data})
        .reply(200, expectedErrorResponse);

      const expectedActions = expectedErrorActions();
      return store.dispatch(actions.updateAdminUserDataAsync())
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
  });

  it('should work correctly: function resetAdminUserData', () => {
    const user = translators[0];
    let _initialState = cloneState();
    Object.assign(_initialState.admin.editUser, {
      dataSource: getEditableUserDataObject(user),
      data: getEditableUserDataObject(user)
    });
    let expectedState = cloneState(_initialState);

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
