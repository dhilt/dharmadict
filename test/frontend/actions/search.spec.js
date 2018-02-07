const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, terms, getNotificationAction, appPath} = require('../_shared.js');

const actionsCreators = require(appPath + 'actions/search');
const types = require(appPath + 'actions/_constants');
const reducer = require(appPath + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('search actions', () => {
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

  describe('function changeSearchString', () => {
    let newSearchString = 'newSearchString';
    const expectedAction = {
      type: types.CHANGE_SEARCH_STRING,
      newSearchString
    };

    it('should work, reducer', () => {
      let expectedState = cloneState();
      Object.assign(expectedState.search, {searchString: newSearchString});
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    });

    it('should work, action', () => {
      const store = mockStore(initialState);
      store.dispatch(actionsCreators.changeSearchString(newSearchString));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  describe('function doSearchRequestAsync', () => {
    const searchString = terms[0].wylie;

    const responseSuccess = terms;
    const actions = [
      { type: types.SEARCH_REQUEST_START },
      {
        type: types.SEARCH_REQUEST_END,
        error: null,
        result: terms
      }
    ];
    const states = [
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: true
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: false,
          result: terms,
          started: true,
          error: null
        },
        selected: {...initialState.selected,
          term: null
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t find terms. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: actions[1].type,
        error: responseFail,
        result: null
      },
      getNotificationAction(null, 'SearchInput.request_error')
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: false,
          started: true,
          result: null,
          error: responseFail
        }
      }
    ];

    const createInitialState = () => {
      let _initialState = cloneState(states[0]);
      Object.assign(_initialState.search, { pending: false });
      return _initialState
    };

    it('should work, reducer', () => {
      let _initialState = createInitialState();
      expect(reducer(_initialState, actions[0])).toEqual(states[0]);
      expect(reducer(_initialState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      const store = mockStore(createInitialState());

      nock('http://localhost')
        .get(`/api/terms?pattern=${searchString}`)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.doSearchRequestAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      let _initialState = createInitialState();
      expect(reducer(_initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(_initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(createInitialState());

      nock('http://localhost')
        .get(`/api/terms?pattern=${searchString}`)
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.doSearchRequestAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function selectTermAsync', () => {
    const termId = terms[0].id;
    const term = terms[0].wylie;
    const dataTerm = terms[0];

    const responseSuccess = terms;
    const actions = [
      {
        type: types.CHANGE_SEARCH_STRING,
        newSearchString: term
      },
      { type: types.SEARCH_REQUEST_START },
      {
        type: types.SEARCH_REQUEST_END,
        error: null,
        result: terms
      },
      {
        type: types.SELECT_TERM,
        term: dataTerm
      }
    ];
    const states = [
      { ...initialState,
        search: {
          searchString: term,
          pending: false,
          result: null,
          started: false,
          error: null
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          searchString: term,
          pending: true
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          searchString: term,
          pending: false,
          result: terms,
          started: true,
          error: null
        },
        selected: { ...initialState.selected,
          term: null
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          searchString: term,
          pending: false,
          error: null
        },
        selected: { ...initialState.selected,
          term: dataTerm
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t find terms. Database error'
    };
    const actionsFail = [
      actions[0],
      actions[1],
      {
        type: actions[2].type,
        error: responseFail,
        result: null
      },
      getNotificationAction(null, 'SearchInput.request_error')
    ];
    const statesFail = [
      states[0],
      states[1],
      { ...initialState,
        search: { ...initialState.search,
          searchString: term,
          pending: false,
          started: true,
          result: null,
          error: responseFail
        }
      }
    ];

    const createInitialState = () => {
      let _initialState = cloneState(states[0]);
      Object.assign(_initialState.search, { pending: false });
      return _initialState
    };

    it('should work, reducer', () => {
      const _initialState = createInitialState();
      actions.forEach((action, i) => expect(reducer(_initialState, action)).toEqual(states[i]));
    });

    it('should work, action', () => {
      const store = mockStore(createInitialState());

      nock('http://localhost')
        .get(`/api/terms?pattern=${term}`)
        .reply(200, responseSuccess);

      return store.dispatch(actionsCreators.selectTermAsync(termId))
        .then(() => {
          expect(store.getActions()[0]).toEqual(actions[0]);
          expect(store.getActions()[1]).toEqual(actions[1]);
          expect(store.getActions()[2]).toEqual(actions[2]);
          expect(store.getActions()[3]).toEqual(actions[3]);
        });
    });

    it('should handle error, reducer', () => {
      const _initialState = createInitialState();
      expect(reducer(_initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(_initialState, actionsFail[1])).toEqual(statesFail[1]);
      expect(reducer(_initialState, actionsFail[2])).toEqual(statesFail[2]);
    });

    it('should handle error, action', () => {
      const store = mockStore(createInitialState());

      nock('http://localhost')
        .get(`/api/terms?pattern=${term}`)
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.selectTermAsync(termId))
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function selectTerm', () => {

    const term = terms[0].wylie;
    const expectedAction = {
      type: types.SELECT_TERM,
      term
    };
    const expectedState = { ...initialState,
      selected: { ...initialState.selected,
        term
      }
    };

    it('should work, reducer', () => {
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    });

    it('should work, action', () => {
      const store = mockStore(initialState);
      store.dispatch(actionsCreators.selectTerm(term, true));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  describe('function toggleComment', () => {

    const term = terms[0];
    const translationIndex = 1;
    const meaningIndex = 1;
    let newTerm = JSON.parse(JSON.stringify(term));
    let meaning = newTerm.translations[translationIndex].meanings[meaningIndex];
    meaning.openComment = !meaning.openComment;

    const expectedAction = {
      type: types.TOGGLE_COMMENT,
      term: newTerm
    };
    const expectedState = { ...initialState,
      selected: { ...initialState.selected,
        term: newTerm
      }
    };

    it('should work, reducer', () =>
      expect(reducer(initialState, expectedAction)).toEqual(expectedState)
    );

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.selected, { term });
      const store = mockStore(_initialState);

      store.dispatch(actionsCreators.toggleComment(translationIndex, meaningIndex));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });
});
