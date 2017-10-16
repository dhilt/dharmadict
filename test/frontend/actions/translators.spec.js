const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {translators, getNotificationAction} = require('../_shared.js');
const initialState = require('../_shared.js').initialState.get();
const cloneInitialState = require('../_shared.js').initialState.clone;

const actions = require('../../../app/actions/translators');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;
const lang = require('../../../app/helpers/lang').default;

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
    expect(reducer()).toEqual(initialState);
  });

  it('should get translator info async', () => {
    const userId = translators[0].id;
    const expectedSuccessResponse = {
      success: true,
      user: translators.find(elem => elem.id === userId)
    };
    const expectedSuccessActions = [
      { type: types.GET_TRANSLATOR_INFO_START },
      {
        type: types.GET_TRANSLATOR_INFO_END,
        error: null,
        result: expectedSuccessResponse.user
      }
    ];

    // test reducers
    let expectedState = cloneInitialState();
    expectedState.translatorInfo.data = expectedSuccessResponse.user;
    expect(reducer(initialState, expectedSuccessActions[1])).toEqual(expectedState);

    // test async actions
    let store = mockStore(initialState);
    nock('http://localhost')
      .get('/api/users/' + userId)
      .reply(200, expectedSuccessResponse);
    return store.dispatch(actions.getTranslatorInfoAsync(userId))
      .then(() => expect(store.getActions()).toEqual(expectedSuccessActions));
  });

  it('should not get translator info async', () => {
    const userId = translators[0].id;
    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t find user. Database error'
    };
    const expectedErrorActions = [
      { type: types.GET_TRANSLATOR_INFO_START },
      {
        type: types.GET_TRANSLATOR_INFO_END,
        error: expectedErrorResponse,
        result: null
      },
      getNotificationAction(null, 'TranslatorPage.request_error')
    ];

    // test reducers
    let expectedState = cloneInitialState();
    expectedState.translatorInfo.error = expectedErrorActions[1].error;
    expectedState.translatorInfo.data = expectedErrorActions[1].result;
    expect(reducer(initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    let store = mockStore(initialState);
    nock('http://localhost')
      .get('/api/users/' + userId)
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.getTranslatorInfoAsync(userId))
      .then(() => expect(store.getActions()).toEqual(expectedErrorActions));
  });
})
