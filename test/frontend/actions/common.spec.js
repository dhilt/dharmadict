const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, languages, translators, getNotificationAction} = require('../_shared.js');

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

  describe('function getCommonDataAsync', () => {
    const expectedSuccessResponse = {
      success: true,
      translators,
      languages
    };
    const expectedSuccessActions = () => ([
      { type: types.GET_COMMON_DATA_START },
      {
        type: types.GET_COMMON_DATA_END,
        translators,
        languages
      }
    ]);

    it('should work, reducer', () => {
      const actions = expectedSuccessActions();

      // test types.GET_COMMON_DATA_START
      let expectedState = cloneState();
      Object.assign(expectedState.common, {translators: null});
      expect(reducer(initialState, actions[0])).toEqual(expectedState);

      // test types.GET_ADMIN_USER_DATA_END
      Object.assign(expectedState.common, { languages, translators });
      expect(reducer(initialState, actions[1])).toEqual(expectedState);
    });

    it('should work, action', () => {
      let store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/common')
        .reply((uri, requestBody, cb) => {
          cb(null, [200, expectedSuccessResponse])
        });

      return store.dispatch(actions.getCommonDataAsync())
        .then(() => expect(store.getActions()).toEqual(expectedSuccessActions()));
    });

    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t get common data. Database error'
    };
    const expectedErrorActions = () => ([
      { type: types.GET_COMMON_DATA_START },
      {
        type: types.GET_COMMON_DATA_END,
        translators: [],
        languages: []
      },
      getNotificationAction(null, 'App.get_languages_error')
    ]);

    it('should handle error, reducer', () => {
      const actions = expectedErrorActions();

      // test types.GET_COMMON_DATA_START
      let expectedState = cloneState();
      Object.assign(expectedState.common, {translators: null});
      expect(reducer(initialState, actions[0])).toEqual(expectedState);

      // test types.GET_ADMIN_USER_DATA_END
      Object.assign(expectedState.common, { languages: [], translators: [] });
      expect(reducer(initialState, actions[1])).toEqual(expectedState);
    });

    it('should handle error, action', () => {
      let store = mockStore(initialState);

      nock('http://localhost')
        .get('/api/common')
        .reply(304, expectedErrorResponse);

      return store.dispatch(actions.getCommonDataAsync()).then(() => {
        expect(store.getActions()).toEqual(expectedErrorActions())
      });
    });
  });

  describe('function changeUserLanguage', () => {
    const createExpectedAction = (_lang) => ({
      type: types.SET_LANGUAGE,
      language: _lang
    });
    const testChangeUserLanguage = (_lang) => {
      let language = '';
      if (lang.list.find(elem => elem === _lang)) {
        language = _lang
      } else {
        language = lang.defaultLang
      }

      it('should work, helpers/lang.js', () => {
        // test helpers/lang.js
        lang.setUserLanguage(language);
        expect(lang.get(language)).toEqual(language);
        expect(lang.getUserLanguage()).toEqual(language);
      });

      const store = mockStore(initialState);
      let expectedState = cloneState();
      Object.assign(expectedState.common, {userLanguage: language})

      it('should work, reducer', () =>
        // test types.SET_LANGUAGE
        expect(reducer(initialState, createExpectedAction(language))).toEqual(expectedState)
      );

      it('should work, action', () => {
        store.dispatch(actions.changeUserLanguage(language));
        expect(store.getActions()[0]).toEqual(createExpectedAction(language));
      });
    };

    testChangeUserLanguage('en');
    testChangeUserLanguage('ru');
    testChangeUserLanguage('inexistent language');
  });
})
