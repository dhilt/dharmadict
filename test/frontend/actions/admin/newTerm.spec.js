import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import expect from 'expect';

import languages from '../../../../app/helpers/lang';
import * as actions from '../../../../app/actions/admin/newTerm';
import * as types from '../../../../app/actions/_constants';
import reducer from '../../../../app/reducers';
import initialState from '../../../../app/reducers/_initial';

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);
let store = mockStore(initialState);

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

    expect(actions.changeWylie(newWylieString)).toEqual(expectedAction);
    expect(reducer(initialState, expectedAction)).toEqual(expectedState);
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

      expect(actions.changeSanskrit(key, value)).toEqual(expectedAction);
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    });
  });

  it('should save term async', () => {
    const wylie = 'New Term';
    const sanskrit = {};
    languages.list.forEach(elem => {
      sanskrit['sanskrit_' + elem] = 'Sanskrit on ' + elem
    });
    const expectedSuccessResponse = {
      success: true,
      term:	{
        wylie: wylie,
        translations: [],
        id: 'New_Term'
      }
    };
    languages.list.forEach(elem => {
      expectedSuccessResponse.term['sanskrit_' + elem] = sanskrit['sanskrit_' + elem];
      expectedSuccessResponse.term['sanskrit_' + elem + '_lower'] = sanskrit['sanskrit_' + elem].toLowerCase();
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
          type: 'success',
          values: {}
        },
        type: 'CREATE_NOTIFICATION'
      }
    ];

    nock('http://localhost/api')
      .post('/terms', {term: wylie, sanskrit})
      .reply(200, expectedSuccessResponse);

    store.dispatch(actions.saveTermAsync()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedSuccessActions)
    });
  });
})
