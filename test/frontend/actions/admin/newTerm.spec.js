const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, translators, getNotificationAction} = require('../../_shared.js');

const actionsCreators = require('../../../../app/actions/admin/newTerm');
const types = require('../../../../app/actions/_constants');
const reducer = require('../../../../app/reducers').default;
const languages = require('../../../../app/helpers/lang').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

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

    const newWylieString = 'wylie';
    const expectedAction = {
      type: types.CHANGE_NEW_TERM_WYLIE,
      newWylieString
    };
    const expectedState = cloneState();
    Object.assign(expectedState.admin.newTerm, { wylie: newWylieString });

    it('should work, reducer', () =>
      expect(reducer(initialState, expectedAction)).toEqual(expectedState)
    );

    it('should work, action', () =>
      expect(actionsCreators.changeWylie(newWylieString)).toEqual(expectedAction)
    );
  });

  describe('function changeSanskrit', () => {

    const createAction = (key, value) => ({
      type: types.CHANGE_NEW_TERM_SANSKRIT,
      key,
      value
    });
    let _initialState = { ...initialState,
      admin: { ...initialState.admin,
        newTerm: { ...initialState.admin.newTerm,
          sanksrit: {}
        }
      }
    };
    languages.list.forEach(elem =>
      Object.assign(_initialState.admin.newTerm, { [`sanskrit_${elem}`]: `new sanskrit on ${elem}` })
    );

    languages.list.forEach(elem => {
      const key = 'sanskrit_' + elem;
      const value = 'absolutely new_sanskrit on language ' + elem;
      const expectedAction = createAction(key, value);
      let expectedState = cloneState(_initialState);
      Object.assign(expectedState.admin.newTerm.sanskrit, { [key]: value });

      it(`should work with key = ${key}, reducer`, () =>
        expect(reducer(_initialState, expectedAction)).toEqual(expectedState)
      );

      it(`should work with key = ${key}, action`, () =>
        expect(actionsCreators.changeSanskrit(key, value)).toEqual(expectedAction)
      );
    });
  });

  describe('function saveTermAsync', () => {

    const wylie = 'New Term';
    const idWylie = 'New_Term';
    let initialSanskrit = {};
    let expectedSanskrit = {};
    languages.list.forEach(elem => {
      initialSanskrit['sanskrit_' + elem] = 'Sanskrit on ' + elem;
      expectedSanskrit['sanskrit_' + elem] = 'Sanskrit on ' + elem;
      expectedSanskrit['sanskrit_' + elem + '_lower'] = `Sanskrit on ${elem}`.toLowerCase();
    });

    const responseSuccess = {
      success: true,
      term:	{
        wylie,
        sanskrit: expectedSanskrit,
        translations: [],
        id: idWylie
      }
    };
    const actions = [
      { type: types.ADD_TERM_START },
      {
        type: types.ADD_TERM_END,
        error: null,
        termId: responseSuccess.term.id
      },
      getNotificationAction('NewTerm.alert_success', null, {termId: responseSuccess.term.id})
    ];
    const states = [
      { ...initialState,
        admin: { ...initialState.admin,
          newTerm: { ...initialState.admin.newTerm,
            wylie,
            sanskrit: initialSanskrit,
            pending: true
          }
        }
      },
      { ...initialState,
        admin: { ...initialState.admin,
          newTerm: { ...initialState.admin.newTerm,
            wylie,
            sanskrit: initialSanskrit,
            pending: false,
            termId: idWylie
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
      { ...initialState,
        admin: { ...initialState.admin,
          newTerm: { ...initialState.admin.newTerm,
            wylie,
            sanskrit: initialSanskrit,
            pending: false,
            termId: null,
            error: responseFail
          }
        }
      }
    ];

    const createInitialState = () => {
      let _initialState = cloneState(states[0]);
      Object.assign(_initialState.admin.newTerm, { pending: false });
      return _initialState
    }

    it('should work, reducer', () => {
      const _initialState = createInitialState();
      expect(reducer(_initialState, actions[0])).toEqual(states[0]);
      expect(reducer(_initialState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      const store = mockStore(createInitialState());

      nock('http://localhost')
        .post('/api/terms', {
          term: store.getState().admin.newTerm.wylie,
          sanskrit: store.getState().admin.newTerm.sanskrit
        })
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.saveTermAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      const _initialState = createInitialState();
      expect(reducer(_initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(_initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should work, action', () => {
      const store = mockStore(createInitialState());

      nock('http://localhost')
        .post('/api/terms', {
          term: store.getState().admin.newTerm.wylie,
          sanskrit: store.getState().admin.newTerm.sanskrit
        })
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.saveTermAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
})
