const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, translators, getNotificationAction, getAppPath} = require('../../_shared.js');

const actionCreators = require(getAppPath(2) + 'actions/translator/changePassword');
const types = require(getAppPath(2) + 'actions/_constants');
const reducer = require(getAppPath(2) + 'reducers').default;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('translator/changePassword actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () =>
    expect(reducer()).toEqual(initialState)
  );

  describe('function updateTranslatorPasswordAsync', () => {

    const user = translators[0];
    const userId = user.id;
    const data = {
      currentPassword: 'current password',
      newPassword: 'new password',
      confirmPassword: 'new password'
    };
    const startState = {...initialState,
      translator: {...initialState.translator,
        editPassword: Object.assign(initialState.translator.editPassword, data)
      }
    };

    const responseSuccess = {
      success: true,
      user
    };
    const actions = [
      { type: types.UPDATE_TRANSLATOR_PASSWORD_START },
      {
        type: types.UPDATE_TRANSLATOR_PASSWORD_END,
        error: null
      },
      getNotificationAction('EditPasswordByTranslator.new_password_success', null)
    ];
    const states = [
      {...initialState,
        translator: {...initialState.translator,
          editPassword: {...initialState.translator.editPassword,
            pending: true
          }
        }
      },
      {...initialState,
        translator: {...initialState.translator,
          editPassword: {...initialState.translator.editPassword,
            error: null
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t update password. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: actions[1].type,
        error: responseFail
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      {...initialState,
        translator: {...initialState.translator,
          editPassword: {...initialState.translator.editPassword,
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
      const store = mockStore(startState);

      nock('http://localhost')
        .patch('/api/translators/' + user.id, {
          payload: data
        })
        .reply(200, responseSuccess);

      return store
        .dispatch(actionCreators.updateTranslatorPasswordAsync(user.id))
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .patch('/api/translators/' + user.id, {
          payload: data
        })
        .reply(200, responseFail);

      return store
        .dispatch(actionCreators.updateTranslatorPasswordAsync(user.id))
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function changeTranslatorPassword', () => {

    const testChangeTranslatorPassword = (key, value) => {

      let passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };

      let stateStart = {...initialState,
        translator: {...initialState.translator,
          editPassword: passwordData
        }
      };

      let stateEnd = Object.assign({}, stateStart);
      stateEnd.translator.editPassword[key] = value;

      let action = {
        type: types.CHANGE_TRANSLATOR_PASSWORD,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      };
      action[key] = value;

      it(`should change ${key}, reducer`, () =>
        expect(reducer(stateStart, action)).toEqual(stateEnd)
      );

      it(`should change ${key}, action`, () => {
        const store = mockStore(stateStart);
        store.dispatch(actionCreators.changeTranslatorPassword({[key]: value}));
        expect(store.getActions()).toEqual([action]);
      });
    };

    testChangeTranslatorPassword('currentPassword', 'current password');
    testChangeTranslatorPassword('newPassword', 'new password');
    testChangeTranslatorPassword('confirmPassword', 'new password');
  });

  describe('function resetTranslatorPasswords', () => {

    const emptyPasswords = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    const startState = {...initialState,
      translator: {...initialState.translator,
        editPassword: {...initialState.translator.editPassword,
          currentPassword: 'current password',
          newPassword: 'new password',
          confirmPassword: 'new password'
        }
      }
    };

    let endState = Object.assign({}, startState);
    Object.assign(endState.translator.editPassword, emptyPasswords);

    const action = {
      ...emptyPasswords,
      type: types.CHANGE_TRANSLATOR_PASSWORD
    };

    it('should work, reducer', () =>
      expect(reducer(startState, action)).toEqual(endState)
    );

    it('should work, action', () => {
      const store = mockStore(startState);
      store.dispatch(actionCreators.resetTranslatorPasswords());
      expect(store.getActions()).toEqual([action]);
    });
  });
});
