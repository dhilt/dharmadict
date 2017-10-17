const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, translators, getNotificationAction} = require('../../_shared.js');

const actions = require('../../../../app/actions/admin/newTerm');
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

    it('should work, reducer', () => {
      // test types.CHANGE_NEW_TERM_WYLIE
      let expectedState = cloneState();
      expectedState.admin.newTerm.wylie = newWylieString;
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    });
    it('should work, action', () => {
      expect(actions.changeWylie(newWylieString)).toEqual(expectedAction);
    });
  });

  describe('function changeSanskrit', () => {
    const createAction = (key, value) => ({
      type: types.CHANGE_NEW_TERM_SANSKRIT,
      key,
      value
    });

    let lastState = cloneState();
    // test the change of the language separately
    languages.list.forEach(elem => {
      const key = 'sanskrit_' + elem;
      const value = 'new_sanskrit on language ' + elem;
      const expectedAction = createAction(key, value);
      let expectedState = cloneState();
      expectedState.admin.newTerm.sanskrit[key] = value;
      lastState.admin.newTerm.sanskrit[key] = value;

      it(`should work with key = ${key}, reducer`, () =>
        // test types.CHANGE_NEW_TERM_SANSKRIT
        expect(reducer(initialState, expectedAction)).toEqual(expectedState)
      );
      it(`should work with key = ${key}, action`, () =>
        expect(actions.changeSanskrit(key, value)).toEqual(expectedAction)
      );
    });

    // test the change of the language separately, with already existing data
    const lastExpectedState = cloneState(lastState);
    const key = 'sanskrit_' + languages.list[0];
    const value = 'new_sanskrit on language ' + languages.list[0];
    const lastExpectedAction = createAction(key, value);
    lastExpectedState.admin.newTerm.sanskrit[key] = value;
    it(`should work with key = ${key}, reducer`, () =>
      expect(reducer(lastState, lastExpectedAction)).toEqual(lastExpectedState)
    );
    it(`should work with key = ${key}, action`, () =>
      expect(actions.changeSanskrit(key, value)).toEqual(lastExpectedAction)
    );
  });

  describe('function saveTermAsync', () => {
    const wylie = 'New Term';
    const sanskrit = {};
    languages.list.forEach(elem => {
      sanskrit['sanskrit_' + elem] = 'Sanskrit on ' + elem;
      sanskrit['sanskrit_' + elem + '_lower'] = `Sanskrit on ${elem}`.toLowerCase();
    });
    const createInitialState = () => {
      let _initialState = cloneState();
      Object.assign(_initialState.admin.newTerm, {
        termId: null,
        error: null,
        pending: false,
        sanskrit,
        wylie
      });
      return _initialState
    };

    const expectedSuccessResponse = {
      success: true,
      term:	{
        wylie,
        sanskrit,
        translations: [],
        id: 'New_Term'
      }
    };
    const expectedSuccessActions = () => ([
      { type: types.ADD_TERM_START },
      {
        type: types.ADD_TERM_END,
        error: null,
        termId: expectedSuccessResponse.term.id
      },
      getNotificationAction('NewTerm.alert_success', null, {termId: expectedSuccessResponse.term.id})
    ]);
    const createSuccessExpectedState = () => {
      let _initialState = createInitialState();
      Object.assign(_initialState.admin.newTerm, {
        termId: expectedSuccessResponse.term.id
      });
      return _initialState
    };

    it('should work, reducer', () => {
      const actions = expectedSuccessActions();

      // test types.ADD_TERM_START
      const _initialState = createInitialState();
      let expectedState = createInitialState();
      Object.assign(expectedState.admin.newTerm, {pending: true});
      expect(reducer(_initialState, actions[0])).toEqual(expectedState);

      // test types.ADD_TERM_END
      expectedState = createSuccessExpectedState();
      expect(reducer(_initialState, actions[1])).toEqual(expectedState);
    });

    it('should work, action', () => {
      const expectedActions = expectedSuccessActions();

      const expectedState = createSuccessExpectedState();
      const _initialState = createInitialState();
      let store = mockStore(_initialState);

      nock('http://localhost')
        .post('/api/terms', {
          term: _initialState.admin.newTerm.wylie,
          sanskrit: _initialState.admin.newTerm.sanskrit
        })
        .reply(200, expectedSuccessResponse);

      return store.dispatch(actions.saveTermAsync()).then(() => {
        let successNotification = store.getActions().find(elem => elem.type === types.CREATE_NOTIFICATION);
        delete successNotification.notification.timer;  // remove function-property
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t create new term. Unauthorized access. Database error'
    };
    const expectedErrorActions = () => ([
      { type: types.ADD_TERM_START },
      {
        type: types.ADD_TERM_END,
        termId: null,
        error: expectedErrorResponse
      },
      getNotificationAction(null, expectedErrorResponse.message)
    ]);
    const createErrorExpectedState = () => {
      let _initialState = createInitialState();
      Object.assign(_initialState.admin.newTerm, {
        error: expectedErrorResponse,
        termId: null
      });
      return _initialState
    };

    it('should handle error, reducer', () => {
      const actions = expectedErrorActions();

      // test types.ADD_TERM_START
      const _initialState = createInitialState();
      let expectedState = createInitialState();
      Object.assign(expectedState.admin.newTerm, {pending: true});
      expect(reducer(_initialState, actions[0])).toEqual(expectedState);

      // test types.ADD_TERM_END
      expectedState = createErrorExpectedState();
      expect(reducer(_initialState, actions[1])).toEqual(expectedState);
    });

    it('should work, action', () => {
      const expectedActions = expectedErrorActions();

      const expectedState = createErrorExpectedState();
      const _initialState = createInitialState();
      let store = mockStore(_initialState);

      nock('http://localhost')
        .post('/api/terms', {
          term: _initialState.admin.newTerm.wylie,
          sanskrit: _initialState.admin.newTerm.sanskrit
        })
        .reply(200, expectedErrorResponse);

      return store.dispatch(actions.saveTermAsync()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
})
