const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, translators, getNotificationAction, getAppPath} = require('../../_shared.js');

const actionsCreators = require(getAppPath(2) + 'actions/admin/newTerm');
const types = require(getAppPath(2) + 'actions/_constants');
const reducer = require(getAppPath(2) + 'reducers').default;
const languages = require(getAppPath(2) + 'helpers/lang').default;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin/newTerm actions', () => {
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

  describe('function changeWylie', () => {

    const input = 'mewWylie';
    const action = {
      type: types.CHANGE_NEW_TERM_WYLIE,
      newWylieString: input
    };
    const state = { ...initialState,
      admin: { ...initialState.admin,
        newTerm: { ...initialState.admin.newTerm,
          wylie: input
        }
      }
    };

    it('should work, reducer', () =>
      expect(reducer(initialState, action)).toEqual(state)
    );

    it('should work, action', () =>
      expect(actionsCreators.changeWylie(input)).toEqual(action)
    );
  });

  describe('function changeSanskrit', () => {

    const startState = {...initialState,
      admin: {...initialState.admin,
        newTerm: {...initialState.admin.newTerm,
          ...languages.list.reduce((obj, lang) =>
            Object.assign(obj, { [`sanskrit_${lang}`]: `sanskrit for ${lang}` })
          , {})
        }
      }
    };
    const createAction = (key, value) => ({
      type: types.CHANGE_NEW_TERM_SANSKRIT,
      key,
      value
    });

    languages.list.forEach(elem => {
      const key = 'sanskrit_' + elem;
      const value = 'new sanskrit for ' + elem;
      const action = createAction(key, value);
      const state = { ...startState };
      Object.assign(state.admin.newTerm.sanskrit, { [key]: value });

      it(`should work with key = ${key}, reducer`, () =>
        expect(reducer(startState, action)).toEqual(state)
      );

      it(`should work with key = ${key}, action`, () =>
        expect(actionsCreators.changeSanskrit(key, value)).toEqual(action)
      );
    });
  });

  describe('function saveTermAsync', () => {

    const wylie = 'New Term Wylie';
    const termId = 'New_Term_Id';
    const startState = { ...initialState,
      admin: { ...initialState.admin,
        newTerm: { ...initialState.admin.newTerm,
          wylie,
          sanskrit: languages.list.reduce((obj, lang) =>
            Object.assign(obj, { [`sanskrit_${lang}`]: `Sanskrit for ${lang}` })
          , {})
        }
      }
    };

    const responseSuccess = {
      success: true,
      term:	{
        wylie,
        sanskrit: languages.list.reduce((obj, lang) =>
          Object.assign(obj, {
            [`sanskrit_${lang}`]: startState.admin.newTerm.sanskrit[`sanskrit_${lang}`],
            [`sanskrit_${lang}_lower`]: startState.admin.newTerm.sanskrit[`sanskrit_${lang}`].toLowerCase()
          }), {}),
        translations: [],
        id: termId
      }
    };
    const actions = [
      { type: types.ADD_TERM_START },
      {
        type: types.ADD_TERM_END,
        error: null,
        termId
      },
      getNotificationAction('NewTerm.alert_success', null, { termId })
    ];
    const states = [
      { ...startState,
        admin: { ...startState.admin,
          newTerm: { ...startState.admin.newTerm,
            pending: true
          }
        }
      },
      { ...startState,
        admin: { ...startState.admin,
          newTerm: { ...startState.admin.newTerm,
            termId
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t create new term. Unauthorized access. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: types.ADD_TERM_END,
        termId: null,
        error: responseFail
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      { ...startState,
        admin: { ...startState.admin,
          newTerm: { ...startState.admin.newTerm,
            error: responseFail
          }
        }
      }
    ];

    it('should work, reducer', () => {
      expect(reducer(startState, actions[0])).toEqual(states[0]);
      expect(reducer(startState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .post('/api/terms', {
          term: store.getState().admin.newTerm.wylie,
          sanskrit: store.getState().admin.newTerm.sanskrit
        })
        .reply(200, responseSuccess);

      store
        .dispatch(actionsCreators.saveTermAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(startState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(startState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should work, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .post('/api/terms', {
          term: store.getState().admin.newTerm.wylie,
          sanskrit: store.getState().admin.newTerm.sanskrit
        })
        .reply(200, responseFail);

      store
        .dispatch(actionsCreators.saveTermAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
});
