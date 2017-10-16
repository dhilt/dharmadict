const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {translators} = require('../../_shared.js');

const actions = require('../../../../app/actions/admin/newTerm');
const types = require('../../../../app/actions/_constants');
const reducer = require('../../../../app/reducers').default;
const initialState = require('../../../../app/reducers/_initial').default;
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

  it('should work correctly: function changeWylie', () => {
    const newWylieString = 'wylie';
    const expectedAction = {
      type: types.CHANGE_NEW_TERM_WYLIE,
      newWylieString
    };
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.wylie = newWylieString;

    // test types.CHANGE_NEW_TERM_WYLIE
    expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    // test action
    expect(actions.changeWylie(newWylieString)).toEqual(expectedAction);
  });

  it('should work correctly: function changeSanskrit', () => {
    let lastState = JSON.parse(JSON.stringify(initialState));
    languages.list.forEach(elem => {
      const key = 'sanskrit_' + elem;
      const value = 'new_sanskrit on language ' + elem;
      const expectedAction = {
        type: types.CHANGE_NEW_TERM_SANSKRIT,
        key,
        value
      };
      let expectedState = JSON.parse(JSON.stringify(initialState));
      expectedState.admin.newTerm.sanskrit[key] = value;
      lastState.admin.newTerm.sanskrit[key] = value;

      // test types.CHANGE_NEW_TERM_SANSKRIT
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
      // test action
      expect(actions.changeSanskrit(key, value)).toEqual(expectedAction);
    });

    const lastExpectedAction = {
      type: types.CHANGE_NEW_TERM_SANSKRIT,
      key: 'sanskrit_' + languages.list[0],
      value: 'new_new_new_term'
    }
    const lastExpectedState = JSON.parse(JSON.stringify(lastState));
    lastExpectedState.admin.newTerm.sanskrit[lastExpectedAction.key] = lastExpectedAction.value;
    expect(reducer(lastState, lastExpectedAction)).toEqual(lastExpectedState);
    expect(actions.changeSanskrit(lastExpectedAction.key, lastExpectedAction.value)).toEqual(lastExpectedAction);
  });

  it('should work correctly: function saveTermAsync', () => {
    const wylie = 'New Term';
    const expectedSuccessResponse = {
      success: true,
      term:	{
        wylie,
        translations: [],
        id: 'New_Term'
      }
    };
    languages.list.forEach(elem => {
      expectedSuccessResponse.term['sanskrit_' + elem] = 'Sanskrit on ' + elem;
      expectedSuccessResponse.term['sanskrit_' + elem + '_lower'] = ('Sanskrit on ' + elem).toLowerCase();
    });
    const expectedSuccessActions = [
      { type: types.ADD_TERM_START },
      {
        type: types.ADD_TERM_END,
        error: null,
        termId: expectedSuccessResponse.term.id
      },
      {
        type: types.CREATE_NOTIFICATION,
        idLast: 1,
        notification: {
          id: 1,
          text: 'NewTerm.alert_success',
          ttl: 3000,
          type: 'success',
          values: {termId: expectedSuccessResponse.term.id}
        },
      }
    ];

    // test types.ADD_TERM_START
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.pending = true;
    expectedState.admin.newTerm.error = null;
    expect(reducer(initialState, expectedSuccessActions[0])).toEqual(expectedState);

    // test types.ADD_TERM_END
    expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.termId = expectedSuccessResponse.term.id;
    expectedState.admin.newTerm.error = null;
    expect(reducer(initialState, expectedSuccessActions[1])).toEqual(expectedState);

    // test async actions
    let _initialState = JSON.parse(JSON.stringify(initialState));
    _initialState.admin.newTerm.wylie = wylie;
    languages.list.forEach(elem =>
      _initialState.admin.newTerm.sanskrit['sanskrit_' + elem] = 'Sanskrit on ' + elem
    );
    let store = mockStore(_initialState);

    nock('http://localhost')
      .post('/api/terms', {
        term: store.getState().admin.newTerm.wylie,
        sanskrit: store.getState().admin.newTerm.sanskrit
      })
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.saveTermAsync()).then(() => {
      let successNotification = store.getActions().find(elem => elem.type === types.CREATE_NOTIFICATION);
      delete successNotification.notification.timer;  // remove function-property
      expect(store.getActions()).toEqual(expectedSuccessActions);
    });
  });

  it('should handle error correctly: function saveTermAsync', () => {
    const wylie = 'New Term';
    const expectedErrorResponse = {
      error: true,
      code: 500,
      message: 'Can\'t create new term. Unauthorized access. Database error'
    };
    const expectedErrorActions = [
      { type: types.ADD_TERM_START },
      {
        type: types.ADD_TERM_END,
        termId: null,
        error: expectedErrorResponse
      },
      {
        idLast: 1,
        notification: {
          id: 1,
          text: expectedErrorResponse.message,
          ttl: -1,
          type: 'danger',
          values: {}
        },
        type: types.CREATE_NOTIFICATION
      }
    ];

    // test types.ADD_TERM_START
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.pending = true;
    expect(reducer(initialState, expectedErrorActions[0])).toEqual(expectedState);

    // test types.ADD_TERM_END
    expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.error = expectedErrorActions[1].error;
    expectedState.admin.newTerm.termId = null;
    expect(reducer(initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    let _initialState = JSON.parse(JSON.stringify(initialState));
    _initialState.admin.newTerm.wylie = wylie;
    languages.list.forEach(elem =>
      _initialState.admin.newTerm.sanskrit['sanskrit_' + elem] = 'Sanskrit on ' + elem
    );
    let store = mockStore(_initialState);

    nock('http://localhost')
      .post('/api/terms', {
        term: store.getState().admin.newTerm.wylie,
        sanskrit: store.getState().admin.newTerm.sanskrit
      })
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.saveTermAsync()).then(() => {
      expect(store.getActions()).toEqual(expectedErrorActions);
    });
  });
})
