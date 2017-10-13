const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

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
    nock.enableNetConnect('127.0.0.1');
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should change wylie', () => {
    const newWylieString = 'wylie';
    const expectedAction = {
      type: types.CHANGE_NEW_TERM_WYLIE,
      newWylieString
    };
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.wylie = newWylieString;

    // test reducers
    expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    // test actions
    expect(actions.changeWylie(newWylieString)).toEqual(expectedAction);
  });

  it('should change sanskrit', () => {
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

      // test reducers
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
      // test actions
      expect(actions.changeSanskrit(key, value)).toEqual(expectedAction);
    });
  });

  it('should save term async', () => {
    const expectedSuccessResponse = {
      success: true,
      term:	{
        wylie: 'New Term',
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
        idLast: 1,
        notification: {
          id: 1,
          text: 'NewTerm.alert_success',
          ttl: 3000,
          // timer: 16,  // it will be removed further
          type: 'success',
          values: {termId: expectedSuccessResponse.term.id}
        },
        type: types.CREATE_NOTIFICATION
      }
    ];

    // test reducers
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.termId = expectedSuccessActions[1].termId;
    expect(reducer(initialState, expectedSuccessActions[1])).toEqual(expectedState);
    let nextState = JSON.parse(JSON.stringify(expectedState));
    expectedState.notifications.list.push(expectedSuccessActions[2].notification);
    expectedState.notifications.idLast = expectedSuccessActions[2].idLast;
    expect(reducer(nextState, expectedSuccessActions[2])).toEqual(expectedState);

    // test async actions
    let store = mockStore(initialState);
    nock('http://localhost')
      .post('/api/terms')
      .reply(200, expectedSuccessResponse);
    return store.dispatch(actions.saveTermAsync()).then(() => {
      let storeActions = store.getActions();
      delete storeActions[2].notification.timer;  // remove function-property
      expect(store.getActions()).toEqual(expectedSuccessActions)
    });
  });

  it('should not save term async', () => {
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

    // test reducers
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.error = expectedErrorActions[1].error;
    expect(reducer(initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    let store = mockStore(initialState);
    nock('http://localhost')
      .post('/api/terms')
      .reply(200, expectedErrorResponse);
    return store.dispatch(actions.saveTermAsync()).then(() => {
      expect(store.getActions()).toEqual(expectedErrorActions)
    });
  });
})
