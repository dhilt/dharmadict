const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, terms, translators} = require('../_shared.js');

const actions = require('../../../app/actions/search');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;
const lang = require('../../../app/helpers/lang').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('common actions', () => {
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
    expect(reducer()).toEqual(initialState);
  });

  it('should change search string', () => {
    let newSearchString = 'newSearchString';
    const expectedAction = [{
      type: types.CHANGE_SEARCH_STRING,
      newSearchString
    }];

    // test reducers
    let expectedState = cloneState();
    expectedState.search.searchString = newSearchString;
    expect(reducer(initialState, expectedAction[0])).toEqual(expectedState);

    // test actions
    let store = mockStore(initialState);
    store.dispatch(actions.changeSearchString(newSearchString));
    expect(store.getActions()).toEqual(expectedAction);
  });

  it('should correctly work. Function: doSearchRequestAsync', () => {
    // ...
  });

  it('should correctly handle error. Function: doSearchRequestAsync', () => {
    // ...
  });
})
