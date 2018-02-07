const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, translators, getNotificationAction, appPath} = require('../_shared.js');

const actionsCreators = require(appPath + 'actions/translators');
const types = require(appPath + 'actions/_constants');
const reducer = require(appPath + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('translators actions', () => {
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

  describe('function getTranslatorInfoAsync', () => {

    const userId = translators[0].id;
    const user = translators.find(elem => elem.id === userId);

    const responseSuccess = {
      success: true,
      user
    };
    const actions = [
      { type: types.GET_TRANSLATOR_INFO_START },
      {
        type: types.GET_TRANSLATOR_INFO_END,
        error: null,
        result: user
      }
    ];
    const states = [
      { ...initialState,
        translatorInfo: {...initialState.translatorInfo,
          pending: true
        }
      },
      { ...initialState,
        translatorInfo: {...initialState.translatorInfo,
          pending: false,
          data: user,
          error: null
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
        type: types.GET_TRANSLATOR_INFO_END,
        error: responseFail,
        result: null
      },
      getNotificationAction(null, 'TranslatorPage.request_error')
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        translatorInfo: {...initialState.translatorInfo,
          pending: false,
          data: null,
          error: responseFail
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
        .get('/api/users/' + userId)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.getTranslatorInfoAsync(userId))
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/users/' + userId)
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.getTranslatorInfoAsync(userId))
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
});
