const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, terms, translators, getNotificationAction} = require('../_shared.js');

const actionsCreators = require('../../../app/actions/edit');
const {getTranslationCopy} = require('../../../app/actions/edit');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('common actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    // console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('function selectTranslation', () => {

    const term = terms[0];
    const termId = term.id;
    const termName = term.wylie;
    const translatorId = translators[0].id;
    const translation = term.translations.find(elem => elem.translatorId === translatorId);
    const emptyTranslation = {
      meanings: [],
      translatorId
    }

    const responseSuccess = {
      result: { termName, termId, translation }
    };
    const actions = [
      { type: types.TRANSLATION_REQUEST_START },
      {
        type: types.TRANSLATION_REQUEST_END,
        termId,
        termName,
        translation,
        translationCopy: getTranslationCopy(translation),
        error: null
      }
    ];
    const states = [
      { ...initialState,
        edit: { ...initialState.edit,
          pending: true
        }
      },
      { ...initialState,
        edit: { ...initialState.edit,
          started: true,
          pending: false,
          change: null,
          termId,
          termName,
          source: translation,
          change: getTranslationCopy(translation),
          error: null
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t find translations. Database error'
    };
    const actionsFail = [
      actions[0],
      getNotificationAction(null, responseFail),
      {
        type: actions[1].type,
        translation: emptyTranslation,
        translationCopy: emptyTranslation,
        termId: '',
        termName: '',
        error: responseFail
      }
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        edit: { ...initialState.edit,
          pending: false,
          source: emptyTranslation,
          change: emptyTranslation,
          started: true,
          termId: '',
          termName: '',
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
        .get(`/api/terms/translation?translatorId=${translatorId}&termId=${termId}`)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.selectTranslation(translatorId, termId))
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[2])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(initialState);

      nock('http://localhost')
        .get(`/api/terms/translation?translatorId=${translatorId}&termId=${termId}`)
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.selectTranslation(translatorId, termId))
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
})
