const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneInitialState, languages, translators, getNotificationAction} = require('../_shared.js');

const actions = require('../../../app/actions/common');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;
const lang = require('../../../app/helpers/lang').default;

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

    // test reducers
    let expectedState = cloneInitialState();
    expectedState.common.languages = expectedSuccessActions[1].languages;
    expectedState.common.translators = expectedSuccessActions[1].translators;
    expect(reducer(initialState, expectedSuccessActions[1])).toEqual(expectedState);


    // test async actions
    let store = mockStore(initialState);
    nock('http://localhost')
      .get('/api/common')
      .reply((uri, requestBody, cb) => {
        cb(null, [200, expectedSuccessResponse])
      });
    return store.dispatch(actions.getCommonDataAsync())
      .then(() => expect(store.getActions()).toEqual(expectedSuccessActions));
  });

  it('should not get common data async', () => {
    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t get common data. Database error'
    };
    const expectedErrorActions = [
      { type: types.GET_COMMON_DATA_START },
      {
        type: types.GET_COMMON_DATA_END,
        translators: [],
        languages: []
      },
      getNotificationAction(null, 'App.get_languages_error')
    ];

    // test reducers
    let expectedState = cloneInitialState();
    expectedState.common.languages = expectedErrorActions[1].languages;
    expectedState.common.translators = expectedErrorActions[1].translators;
    expect(reducer(initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    let store = mockStore(initialState);
    nock('http://localhost')
      .get('/api/common')
      .reply(304, expectedErrorResponse);
    return store.dispatch(actions.getCommonDataAsync()).then(() => {
      expect(store.getActions()).toEqual(expectedErrorActions)
    });
  });

  it('should change user language on russian', () => {
    const language = 'ru';
    expect(lang.get(language)).toEqual(language);
    const expectedAction = [{
      type: types.SET_LANGUAGE,
      language: language
    }];

    // test reducers
    let expectedState = cloneInitialState();
    expectedState.common.userLanguage = expectedAction[0].language;
    expect(reducer(initialState, expectedAction)).toEqual(expectedState);

    // test actions
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

    // test reducers
    let expectedState = cloneInitialState();
    expectedState.common.userLanguage = expectedAction[0].language;
    expect(reducer(initialState, expectedAction[0])).toEqual(expectedState);

    // test actions
    let store = mockStore(initialState);
    store.dispatch(actions.changeUserLanguage(language));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should change user language on default', () => {
    const language = 'abrakadabra_language';
    expect(lang.get(language)).toEqual(lang.defaultLang);
    const expectedAction = [{
      type: types.SET_LANGUAGE,
      language: lang.get(language)
    }];

    // test reducers
    let expectedState = cloneInitialState();
    expectedState.common.userLanguage = expectedAction[0].language;
    expect(reducer(initialState, expectedAction[0])).toEqual(expectedState);

    // test actions
    let store = mockStore(initialState);
    store.dispatch(actions.changeUserLanguage(language));
    expect(store.getActions()).toEqual(expectedAction);
  });
})
