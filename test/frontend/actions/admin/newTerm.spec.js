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
    console.log = jest.fn();
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
          // timer: 16,  // it will be removed further
          type: 'success',
          values: {termId: expectedSuccessResponse.term.id}
        },
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
    store.dispatch(actions.changeWylie(wylie));
    languages.list.forEach(elem =>
      store.dispatch(actions.changeSanskrit('sanskrit_' + elem, 'value on language' + elem))
    );

    nock('http://localhost')
      .post('/api/terms', {
        term: store.getState().admin.newTerm.wylie,
        sanskrit: store.getState().admin.newTerm.sanskrit
      })
      .reply(200, expectedSuccessResponse);

    return store.dispatch(actions.saveTermAsync()).then(() => {
      const successAction = store.getActions().find(elem => elem.type === types.ADD_TERM_END);
      let successNotification = store.getActions().find(elem => elem.type === types.CREATE_NOTIFICATION);
      delete successNotification.notification.timer;  // remove function-property
      expect(successAction).toEqual(expectedSuccessActions[1]);
      expect(successNotification).toEqual(expectedSuccessActions[2]);
    });
  });

  it('should not save term async', () => {
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

    // test reducers
    let expectedState = JSON.parse(JSON.stringify(initialState));
    expectedState.admin.newTerm.error = expectedErrorActions[1].error;
    expect(reducer(initialState, expectedErrorActions[1])).toEqual(expectedState);

    // test async actions
    let store = mockStore(initialState);
    store.dispatch(actions.changeWylie(wylie));
    languages.list.forEach(elem =>
      store.dispatch(actions.changeSanskrit('sanskrit_' + elem, 'value on language' + elem))
    );

    nock('http://localhost')
      .post('/api/terms', {
        term: store.getState().admin.newTerm.wylie,
        sanskrit: store.getState().admin.newTerm.sanskrit
      })
      .reply(200, expectedErrorResponse);

    return store.dispatch(actions.saveTermAsync()).then(() => {
      const errorAction = store.getActions().find(elem => elem.type === types.ADD_TERM_END);
      let errorNotification = store.getActions().find(elem => elem.type === types.CREATE_NOTIFICATION);
      expect(errorAction).toEqual(expectedErrorActions[1]);
      expect(errorNotification).toEqual(expectedErrorActions[2]);
    });
  });
})
