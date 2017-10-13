const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const actions = require('../../../app/actions/translators');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;
const initialState = require('../../../app/reducers/_initial').default;
const lang = require('../../../app/helpers/lang').default;

const languages = require('../_shared.js').languages;
const translators = require('../_shared.js').translators;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('common actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should get translator info async', () => {
    const userId = 'ZAG';
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

    let store = mockStore(initialState);

    nock('http://localhost')
      .get('/api/users/' + userId)
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.getTranslatorInfoAsync(userId)).then(() => {
      expect(store.getActions()).toEqual(expectedSuccessActions)
    });
  });

  it('should not get translator info async', () => {
    const userId = 'ZAG';
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
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: 'TranslatorPage.request_error',
          ttl: -1,
          type: 'danger',
          values: {}
        }
      }
    ];

    let store = mockStore(initialState);

    nock('http://localhost')
      .get('/api/users/' + userId)
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.getTranslatorInfoAsync(userId)).then(() => {
      expect(store.getActions()).toEqual(expectedErrorActions)
    });
  });
})
