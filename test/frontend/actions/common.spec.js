const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const actions = require('../../../app/actions/common');
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

  it('should get common data async', () => {
    const expectedSuccessResponse = {
      success: true,
      translators,
      languages
    };
    const expectedSuccessActions = [
      { type: types.GET_COMMON_DATA_START },
      {
        type: types.GET_COMMON_DATA_END,
        translators,
        languages
      }
    ];

    let store = mockStore(initialState);

    nock('http://localhost')
      .get('/api/common')
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.getCommonDataAsync()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedSuccessActions)
    });
  });

  it('should not get common data async', () => {
    const expectedErrorErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t get common data. Database error'
    };
    const expectedErrorErrorActions = [
      { type: types.GET_COMMON_DATA_START },
      {
        type: types.GET_COMMON_DATA_END,
        translators: [],
        languages: []
      },
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: 'App.get_languages_error',
          ttl: -1,
          type: 'danger',
          values: {}
        }
      }
    ];

    let store = mockStore(initialState);

    nock('http://localhost')
      .get('/api/common')
      .reply(304, expectedErrorErrorResponse);

    return store.dispatch(actions.getCommonDataAsync()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedErrorErrorActions)
    });
  });

  it('should change user language on russian', () => {
    const language = 'ru';
    expect(lang.get(language)).toEqual(language);
    const expectedAction = [{
      type: types.SET_LANGUAGE,
      language: language
    }];

    let store = mockStore(initialState);

    store.dispatch(actions.changeUserLanguage(language));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should change user language on english', () => {
    const language = 'en';
    expect(lang.get(language)).toEqual(language);
    const expectedAction = [{
      type: types.SET_LANGUAGE,
      language: language
    }];

    let store = mockStore(initialState);

    store.dispatch(actions.changeUserLanguage(language));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should change user language on default', () => {
    const language = 'abrakadabra_language';
    expect(lang.get(language)).toEqual(lang.defaultLang);
    const expectedAction = [{
      type: types.SET_LANGUAGE,
      language: lang.defaultLang
    }];

    let store = mockStore(initialState);

    store.dispatch(actions.changeUserLanguage(language));
    expect(store.getActions()).toEqual(expectedAction);
  });
})
