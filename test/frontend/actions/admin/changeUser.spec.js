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

  describe('function changeAdminUserData', () => {

    const testChangeAdminUserData = (key, value) => {
      const userData = getUserData(translators[0]);

      const stateStart = {...initialState,
        admin: {...initialState.admin,
          editUser: {...initialState.editUser,
            data: userData,
            dataSource: userData
          }
        }
      };

      const stateEnd = Object.assign({}, stateStart);
      stateEnd.admin.editUser.data[key] = value;

      const action = {
        type: types.CHANGE_ADMIN_USER_DATA,
        payload: stateEnd.admin.editUser.data
      };

      it(`should change ${key}, reducer`, () =>
        expect(reducer(stateStart, action)).toEqual(stateEnd)
      );

      it(`should change ${key}, action`, () => {
        let store = mockStore(stateStart);
        store.dispatch(actionCreators.changeAdminUserData({[key]: value}));
        expect(store.getActions()).toEqual([action]);
      });
    };

    testChangeAdminUserData('name', 'new name of user/translator');
    testChangeAdminUserData('language', 'new language of user/translator');
    testChangeAdminUserData('description', 'new description of user/translator');
  });

  describe('function updateAdminUserDataAsync', () => {

    const user = translators[0];
    const userData = getUserData(user);
    const changedUserData = {...userData,
      name: 'New name of user/translator'
    };

    const startState = {...initialState,
      admin: {...initialState.admin,
        editUser: {...initialState.admin.editUser,
          id: user.id,
          data: changedUserData,
          dataSource: userData
        }
      }
    };

    const responseSuccess = {
      success: true,
      user: changedUserData
    };
    const actions = [
      { type: types.UPDATE_ADMIN_USER_DATA_START },
      {
        type: types.UPDATE_ADMIN_USER_DATA_END,
        error: null,
        data: changedUserData
      },
      getNotificationAction('EditUser.success', null)
    ];
    const states = [
      { ...startState,
        admin: { ...startState.admin,
          editUser: { ...startState.admin.editUser,
            pending: true
          }
        }
      },
      { ...startState,
        admin: { ...startState.admin,
          editUser: { ...startState.admin.editUser,
            pending: false,
            dataSource: changedUserData
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t update user data. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: actions[1].type,
        error: responseFail,
        data: userData
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...startState,
        admin: { ...startState.admin,
          editUser: { ...startState.admin.editUser,
            pending: false,
            error: responseFail,
            data: changedUserData,
            dataSource: userData
          }
        }
      }
    ];

    it('should work, reducer', () => {
      expect(reducer(startState, actions[0])).toEqual(states[0]);
      expect(reducer(startState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .patch('/api/users/' + user.id, {payload: changedUserData})
        .reply(200, responseSuccess);

      return store
        .dispatch(actionCreators.updateAdminUserDataAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(startState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(startState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .patch('/api/users/' + user.id, {payload: changedUserData})
        .reply(200, responseFail);

      return store
        .dispatch(actionCreators.updateAdminUserDataAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });

  });

  describe('function resetAdminUserData', () => {

    const userData = getUserData(translators[0]);
    const changedUserData = {...userData,
      name: 'New name of user/translator',
      description: 'New description'
    };

    const startState = {...initialState,
      admin: {...initialState.admin,
        editUser: {...initialState.admin.editUser,
          id: translators[0].id,
          data: changedUserData,
          dataSource: userData
        }
      }
    };

    const endState = Object.assign({}, startState);
    endState.admin.editUser.data = userData;

    const action = {
      type: types.CHANGE_ADMIN_USER_DATA,
      payload: userData
    };

    it('should work, reducer', () =>
      expect(reducer(startState, action)).toEqual(endState)
    );

    it('should work, action', () => {
      const store = mockStore(startState);
      store.dispatch(actionCreators.resetAdminUserData());
      expect(store.getActions()).toEqual([action]);
    });
  });
});
