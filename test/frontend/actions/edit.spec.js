const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, terms, translators, getNotificationAction, appPath} = require('../_shared.js');

const actionsCreators = require(appPath + 'actions/edit');
const {getTranslationCopy} = require(appPath + 'actions/edit');
const types = require(appPath + 'actions/_constants');
const reducer = require(appPath + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('edit actions', () => {
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

  describe('function saveTranslationAsync', () => {

    const term = terms[0];
    const termId = term.id;
    const termName = term.wylie;
    const translatorId = translators[0].id;
    let newTranslations = JSON.parse(JSON.stringify(term.translations.find(elem => elem.translatorId === translatorId)));
    newTranslations.meanings.forEach(m => delete m.versions_lower);
    newTranslations.meanings.push({
      "versions" : [ "New description of term" ],
      "comment" : ""
    });
    let newTerm = JSON.parse(JSON.stringify(term));
    newTerm.translations = newTerm.translations.map(elem =>
      elem.translatorId === translatorId ? newTranslations : elem
    );

    const responseSuccess = {
      success: true,
      term: {
        termId,
        termName,
        translation: newTranslations
      }
    };
    const actions = [
      { type: types.TRANSLATION_UPDATE_START },
      {
        type: types.TRANSLATION_UPDATE_END,
        error: null,
        searchResult: terms,
        term: newTerm
      }
    ];
    const states = [
      { ...initialState,
        edit: { ...initialState.edit,
          update: {
            pending: true
          }
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          result: terms
        },
        selected: { ...initialState.selected,
          term: newTerm
        },
        edit: { ...initialState.edit,
          update: {
            pending: false,
            error: null
          }
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
      {
        type: actions[1].type,
        error: responseFail,
        searchResult: null,
        term: null
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        search: { ...initialState.search,
          result: null
        },
        selected: { ...initialState.selected,
          term: null
        },
        edit: { ...initialState.edit,
          update: {
            pending: false,
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
      let _initialState = cloneState();
      Object.assign(_initialState, states[1]);
      Object.assign(_initialState.edit, {
        termId,
        change: newTranslations
      });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .patch('/api/terms', {
          termId: termId,
          translation: newTranslations
        })
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.saveTranslationAsync(false))
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState, states[1]);
      Object.assign(_initialState.edit, {
        termId,
        change: newTranslations
      });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .patch('/api/terms', {
          termId: store.getState().edit.termId,
          translation: store.getState().edit.change
        })
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.saveTranslationAsync(false))
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function resetTranslation', () => {

    const source = terms[0].translations[4];

    const actions = [
      {
        type: types.CHANGE_TRANSLATION_LOCAL,
        change: getTranslationCopy(source)
      }
    ];
    const states = [
      { ...initialState,
        edit: { ...initialState.edit,
          change: getTranslationCopy(source),
          source
        }
      }
    ];

    it('should work, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.edit, {
        change: terms[1].translations[1],
        source
      });
      expect(reducer(_initialState, actions[0])).toEqual(states[0]);
    });

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.edit, {
        change: terms[1].translations[1],
        source
      });
      const store = mockStore(_initialState);

      store.dispatch(actionsCreators.resetTranslation());
      expect(store.getActions()).toEqual(actions);
    });
  });

  const testChangeTranslationLocal = (term, translation, _action) => {
    const actions = [
      {
        type: types.CHANGE_TRANSLATION_LOCAL,
        change: translation
      }
    ];
    const states = [
      { ...initialState,
        edit: { ...initialState.edit,
          source: term,
          change: translation
        }
      }
    ];

    it('should work, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.edit, {
        change: translation,
        source: term
      });
      expect(reducer(_initialState, actions[0])).toEqual(states[0]);
    });

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.edit, {
        change: translation,
        source: term
      });
      const store = mockStore(_initialState);
      store.dispatch(_action);
      expect(store.getActions()).toEqual(actions);
    });
  };

  describe('function addNewMeaning', () => {
    const term = terms[0].translations[4];
    let translation = JSON.parse(JSON.stringify(term));
    translation.meanings.push({
      comment: null,
      versions: [""]
    });
    testChangeTranslationLocal(term, translation, actionsCreators.addNewMeaning());
  });

  describe('function onMeaningRemoved', () => {
    const term = terms[0].translations[4];
    const index = 1;
    let translation = JSON.parse(JSON.stringify(term));
    translation.meanings.splice(index, 1);
    testChangeTranslationLocal(term, translation, actionsCreators.onMeaningRemoved(index));
  });

  describe('function onCommentChanged', () => {
    const term = terms[0].translations[4];
    const meaningIndex = 1;
    const value = 'new comment';
    let translation = JSON.parse(JSON.stringify(term));
    let meaning = translation.meanings[meaningIndex];
    meaning.comment = value;
    testChangeTranslationLocal(term, translation, actionsCreators.onCommentChanged(meaningIndex, value));
  });

  describe('function onVersionRemoved', () => {
    const term = terms[0].translations[4];
    const meaningIndex = 1;
    const versionIndex = 1;
    let translation = JSON.parse(JSON.stringify(term));
    let meaning = translation.meanings[meaningIndex];
    meaning.versions.splice(versionIndex, 1);
    testChangeTranslationLocal(term, translation, actionsCreators.onVersionRemoved(meaningIndex, versionIndex));
  });

  describe('function onVersionChanged', () => {
    const term = terms[0].translations[4];
    const meaningIndex = 1;
    const versionIndex = 1;
    const value = 'new version of translation';
    let translation = JSON.parse(JSON.stringify(term));
    let meaning = translation.meanings[meaningIndex];
    meaning.versions[versionIndex] = value;
    if (versionIndex === meaning.versions.length - 1) {
      meaning.versions.push('')
    };
    testChangeTranslationLocal(term, translation, actionsCreators.onVersionChanged(meaningIndex, versionIndex, value));
  });
});
