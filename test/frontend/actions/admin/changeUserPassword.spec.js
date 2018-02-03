const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {translators, initialState, getNotificationAction, getAppPath} = require('../../_shared.js');

const actionsCreators = require(getAppPath(2) + 'actions/admin/changeUserPassword');
const types = require(getAppPath(2) + 'actions/_constants');
const reducer = require(getAppPath(2) + 'reducers').default;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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
    const action = {
      type: types.SET_ADMIN_USER_ID,
      id: userId
    };
    const state = { ...initialState,
      admin: { ...initialState.admin,
        editUserPassword: { ...initialState.admin.editUserPassword,
          id: userId
        }
      }
    };

    it('should work, reducer', () =>
      expect(reducer(initialState, action)).toEqual(state)
    );

    it('should work, action', () =>
      expect(actionsCreators.setUserId(userId)).toEqual(action)
    );
  });

  describe('function changeAdminUserPassword', () => {

    const {password, confirmPassword} = initialState.admin.editUserPassword;
    const startState = {...initialState,
      admin: {...initialState.admin,
        editUserPassword: {...initialState.admin.editUserPassword,
          id: translators[0].id
        }
      }
    };

    const testChangeAdminUserPassword = (input) => {

      const action = {
        type: types.CHANGE_ADMIN_USER_PASSWORD,
        password,
        confirmPassword,
        ...input
      };
      const state = { ...startState,
        admin: { ...startState.admin,
          editUserPassword: { ...startState.admin.editUserPassword,
            ...input
          }
        }
      };
      const store = mockStore(startState);

      it(`should change ${input}, reducer`, () => {
        expect(reducer(startState, action)).toEqual(state);
      });

      it(`should change ${input}, action`, () => {
        store.dispatch(actionsCreators.changeAdminUserPassword(input));
        expect(store.getActions().length).toEqual(1);
        expect(store.getActions()[0]).toEqual(action);
      });
    };

    testChangeAdminUserPassword({'password': 'new password value'});
    testChangeAdminUserPassword({'confirmPassword': 'new confirmPassword value'});
  });

  describe('function resetAdminUserPassword', () => {

    const input = { password: '', confirmPassword: '' };
    const startState = {...initialState,
      admin: {...initialState.admin,
        editUserPassword: {...initialState.admin.editUserPassword,
          id: translators[0].id,
          password: 'pass',
          confirmPassword: 'conf'
        }
      }
    };
    const action = {
      type: types.CHANGE_ADMIN_USER_PASSWORD,
      ...input
    };
    const state = { ...startState,
      admin: { ...startState.admin,
        editUserPassword: { ...startState.admin.editUserPassword,
          ...input
        }
      }
    };

    it('should work, reducer', () =>
      expect(reducer(startState, action)).toEqual(state)
    );

    it('should work, action', () => {
      const store = mockStore(startState);
      store.dispatch(actionsCreators.resetAdminUserPassword());
      expect(store.getActions().length).toEqual(1);
      expect(store.getActions()[0]).toEqual(action);
    });
  });

  describe('function updateAdminUserPasswordAsync', () => {

    const userId = translators[0].id;
    const password = 'new_password';
    const confirmPassword = 'confirm_new_password';

    const startState = {...initialState,
      admin: {...initialState.admin,
        editUserPassword: {...initialState.admin.editUserPassword,
          id: userId,
          password,
          confirmPassword
        }
      }
    };

    const responseSuccess = {
      success: true,
      user: translators[0]
    };
    const actions = [
      { type: types.UPDATE_ADMIN_USER_PASSWORD_START },
      {
        type: types.UPDATE_ADMIN_USER_PASSWORD_END,
        error: null
      },
      getNotificationAction('EditUserPassword.new_password_success', null)
    ];
    const states = [
      { ...startState,
        admin: { ...startState.admin,
          editUserPassword: { ...startState.admin.editUserPassword,
            pending: true
          }
        }
      },
      { ...startState,
        admin: { ...startState.admin,
          editUserPassword: { ...startState.admin.editUserPassword,
            password: '',
            confirmPassword: ''
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
        type: types.UPDATE_ADMIN_USER_PASSWORD_END,
        error: responseFail
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...startState,
        admin: { ...startState.admin,
          editUserPassword: { ...startState.admin.editUserPassword,
            error: responseFail,
            password: '',
            confirmPassword: ''
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
        .patch('/api/users/' + userId, {
          payload: {
            password: store.getState().admin.editUserPassword.password,
            confirmPassword: store.getState().admin.editUserPassword.confirmPassword
          }
        })
        .reply(200, responseSuccess);

      store
        .dispatch(actionsCreators.updateAdminUserPasswordAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(startState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(startState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .patch('/api/users/' + userId, {
          payload: {
            password: store.getState().admin.editUserPassword.password,
            confirmPassword: store.getState().admin.editUserPassword.confirmPassword
          }
        })
        .reply(200, responseFail);

      store
        .dispatch(actionsCreators.updateAdminUserPasswordAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
});
