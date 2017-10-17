const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, translators, getNotificationAction} = require('../../_shared.js');

const actionCreators = require('../../../../app/actions/admin/changeUser');
const types = require('../../../../app/actions/_constants');
const reducer = require('../../../../app/reducers').default;
const getUserData = require('../../../../app/actions/admin/changeUser').getEditableUserDataObject;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('admin/changeUser actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    //console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('function getAdminUserDataAsync', () => {
    const user = translators[0];
    const userData = getUserData(user);
    
    const responseSuccess = {
      success: true,
      user
    };
    const actions = [
      { type: types.GET_ADMIN_USER_DATA_START },
      {
        type: types.GET_ADMIN_USER_DATA_END,
        error: null,
        data: userData,
        id: user.id
      }
    ];
    const states = [
      { ...initialState,
        admin: { ...initialState.admin,
          editUser: { ...initialState.admin.editUser,
            sourcePending: true
          }
        }
      },
      { ...initialState,
        admin: { ...initialState.admin,
          editUser: { ...initialState.admin.editUser,
            sourcePending: false,
            id: user.id,
            data: userData,
            dataSource: userData
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t find user. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: actions[1].type,
        error: responseFail,
        data: initialState.admin.editUser.dataSource,
        id: initialState.admin.editUser.id
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        admin: { ...initialState.admin,
          editUser: { ...initialState.admin.editUser,
            sourcePending: false,
            error: responseFail
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
        .get('/api/users/' + user.id)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionCreators.getAdminUserDataAsync(user.id))
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/users/' + user.id)
        .reply(200, responseFail);

      return store
        .dispatch(actionCreators.getAdminUserDataAsync(user.id))
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
/*
  describe('function changeAdminUserData', () => {

    const testChangeAdminUserData = (obj) => {
      const user = translators[0];
      const key = Object.keys(obj)[0];
      const value = obj[key];
      let _initialState = cloneState();
      Object.assign(_initialState.admin.editUser, {
        data: getUserData(user),
        dataSource: getUserData(user)
      });
      let expectedState = cloneState(_initialState);
      Object.assign(expectedState.admin.editUser.data, {
        [key]: value
      });
      let store = mockStore(_initialState);
      const expectedAction = {
        type: types.CHANGE_ADMIN_USER_DATA,
        payload: expectedState.admin.editUser.data
      };
      it(`should change ${key}, reducer`, () =>
        // test types.CHANGE_ADMIN_USER_DATA
        expect(reducer(_initialState, expectedAction)).toEqual(expectedState)
      );
      it(`should change ${key}, action`, () => {
        store.dispatch(actionCreators.changeAdminUserData(obj));
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
        dataSource: getUserData(user),
        data: getUserData(changedUser)
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
        data: getUserData(changedUser)
      },
      getNotificationAction('EditUser.success', null)
    ]);
    const createSuccessExpectedState = () => {
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        error: null,
        id: user.id,
        pending: false,
        data: getUserData(changedUser),
        dataSource: getUserData(changedUser)
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

      return store.dispatch(actionCreators.updateAdminUserDataAsync()).then(() => {
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
        data: getUserData(user)
      },
      getNotificationAction(null, expectedErrorResponse)
    ]);
    const createErrorExpectedState = () => {
      let expectedState = cloneState();
      Object.assign(expectedState.admin.editUser, {
        error: expectedErrorResponse,
        id: user.id,
        pending: false,
        data: getUserData(changedUser),
        dataSource: getUserData(user)
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
        data: getUserData(changedUser),
        dataSource: getUserData(user)
      });
      let store = mockStore(expectedStateBeforeRequest);

      nock('http://localhost')
        .patch('/api/users/' + user.id, {payload: expectedStateBeforeRequest.admin.editUser.data})
        .reply(200, expectedErrorResponse);

      const expectedActions = expectedErrorActions();
      return store.dispatch(actionCreators.updateAdminUserDataAsync())
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
  });

  it('should work correctly: function resetAdminUserData', () => {
    const user = translators[0];
    let _initialState = cloneState();
    Object.assign(_initialState.admin.editUser, {
      dataSource: getUserData(user),
      data: getUserData(user)
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
    store.dispatch(actionCreators.resetAdminUserData());
    expect(store.getActions()[0]).toEqual(expectedAction);
  });*/
})
