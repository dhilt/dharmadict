const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, translators, getNotificationAction} = require('../_shared.js');

const actions = require('../../../app/actions/translators');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

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
    expect(reducer()).toEqual(initialState);
  });

  describe('function getTranslatorInfoAsync', () => {
    const userId = translators[0].id;
    const user = translators.find(elem => elem.id === userId);

    const expectedSuccessResponse = {
      success: true,
      user
    };
    const expectedSuccessActions = () => ([
      { type: types.GET_TRANSLATOR_INFO_START },
      {
        type: types.GET_TRANSLATOR_INFO_END,
        error: null,
        result: user
      }
    ]);
    const createSuccessExpectedState = () => {
      let _initialState = cloneState();
      Object.assign(_initialState.translatorInfo, {
        data: user,
        error: null,
        pending: false
      });
      return _initialState
    };

    it('should work, reducer', () => {
      const actions = expectedSuccessActions();

      // test types.GET_TRANSLATOR_INFO_START
      let nextState = cloneState();
      Object.assign(nextState.translatorInfo, {pending: true});
      expect(reducer(initialState, actions[0])).toEqual(nextState);

      // test types.GET_TRANSLATOR_INFO_END
      expect(reducer(nextState, actions[1])).toEqual(createSuccessExpectedState());
    });

    it('should work, action', () => {
      const expectedActions = expectedSuccessActions();
      let store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/users/' + userId)
        .reply(200, expectedSuccessResponse);

      return store.dispatch(actions.getTranslatorInfoAsync(userId))
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t find user. Database error'
    };
    const expectedErrorActions = () => ([
      { type: types.GET_TRANSLATOR_INFO_START },
      {
        type: types.GET_TRANSLATOR_INFO_END,
        error: expectedErrorResponse,
        result: null
      },
      getNotificationAction(null, 'TranslatorPage.request_error')
    ]);
    const createErrorExpectedState = () => {
      let _initialState = cloneState();
      Object.assign(_initialState.translatorInfo, {
        data: null,
        error: expectedErrorResponse,
        pending: false
      });
      return _initialState
    };

    it('should handle error, reducer', () => {
      const actions = expectedErrorActions();

      // test types.GET_TRANSLATOR_INFO_START
      let nextState = cloneState();
      Object.assign(nextState.translatorInfo, {pending: true});
      expect(reducer(initialState, actions[0])).toEqual(nextState);

      // test types.GET_TRANSLATOR_INFO_END
      expect(reducer(nextState, actions[1])).toEqual(createErrorExpectedState());
    });

    it('should handle error, action', () => {
      const expectedActions = expectedErrorActions();
      let store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/users/' + userId)
        .reply(200, expectedErrorResponse);

      return store.dispatch(actions.getTranslatorInfoAsync(userId))
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
  });
})
