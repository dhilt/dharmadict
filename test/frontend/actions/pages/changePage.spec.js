const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, pages, getNotificationAction, getAppPath} = require('../../_shared.js');

const actionsCreators = require(getAppPath(2) + 'actions/pages/changePage');
const types = require(getAppPath(2) + 'actions/_constants');
const reducer = require(getAppPath(2) + 'reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('admin/changePage actions', () => {
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

  const cutPageForEdit = (page) => ({ title: page.title, text: page.text })

  describe('function getPageAdminAsync', () => {
    const getTest = (page, role, id, noPermission) => {
      const pageUrl = page.url;
      const pageSource = Object.assign({}, page, { text: 'some old text' });
      const newPage = page;
      const authState = {...initialState.auth,
        userInfo: {...initialState.auth.userInfo,
          data: {
            role: role,
            id: id
          }
        }
      };

      const startState = {...initialState,
        auth: authState,
        admin: {...initialState.admin,
          editPage: {...initialState.admin.editPage,
            dataSource: pageSource,
            data: cutPageForEdit(pageSource),
            url: pageUrl
          }
        }
      };

      const responseSuccess = newPage;
      let actions = [
        { type: types.GET_PAGE_ADMIN_START },
        {
          type: types.GET_PAGE_ADMIN_END,
          noPermission: noPermission,
          dataSource: newPage,
          data: cutPageForEdit(newPage),
          url: pageUrl
        }
      ];
      const states = [
        {...startState,
          admin: {...startState.admin,
            editPage: {...startState.admin.editPage,
              sourcePending: true
            }
          }
        },
        {...startState,
          admin: {...startState.admin,
            editPage: {...startState.admin.editPage,
              noPermission: noPermission,
              sourcePending: false,
              dataSource: newPage,
              data: cutPageForEdit(newPage),
              url: pageUrl
            }
          }
        }
      ];

      const responseFail = {
        error: true,
        code: 500,
        message: 'Can\'t delete page. Database error'
      };
      let actionsFail = [
        actions[0],
        {
          type: types.GET_PAGE_ADMIN_END,
          data: pageSource,
          dataSource: pageSource,
          noPermission: true,
          url: pageUrl
        },
        getNotificationAction(null, responseFail)
      ];
      const statesFail = [
        states[0],
        {...startState,
          admin: {...startState.admin,
            editPage: {...startState.admin.editPage,
              noPermission: true,
              sourcePending: false,
              dataSource: pageSource,
              data: pageSource,
              url: pageUrl
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
        if (noPermission) {
          actions = [
            ...actions,
            getNotificationAction(null, { message: 'You can\'t edit this page' })
          ]
        }

        nock('http://localhost')
          .get('/api/pages?url=' + pageUrl)
          .reply(200, responseSuccess);

        return store
          .dispatch(actionsCreators.getPageAdminAsync(pageUrl))
          .then(() => expect(store.getActions()).toEqual(actions));
      });

      it('should handle error, reducer', () => {
        expect(reducer(startState, actionsFail[0])).toEqual(statesFail[0]);
        expect(reducer(startState, actionsFail[1])).toEqual(statesFail[1]);
      });

      it('should handle error, action', () => {
        const store = mockStore(startState);

        nock('http://localhost')
          .get('/api/pages?url=' + pageUrl)
          .reply(200, responseFail);

        return store
          .dispatch(actionsCreators.getPageAdminAsync(pageUrl))
          .then(() => expect(store.getActions()).toEqual(actionsFail));
      });
    };

    let page = Object.assign({}, pages[0], { author: 'somebody' });
    getTest(page, 'admin', 'ADMIN', false);
    getTest(page, 'admin', 'SOME-ID', false);

    page = Object.assign({}, pages[0], { author: 'our-translator' });
    getTest(page, 'translator', 'our-translator', false);
    getTest(page, 'translator', 'not-our-translator', true);
    getTest(page, 'some-user', 'user-id', true);
  });

  describe('function updatePageAsync', () => {

    const pageUrl = pages[0].url;
    const initSource = Object.assign({}, pages[0]);
    const initPage = Object.assign({}, cutPageForEdit(initSource));
    const newSource = {...initSource, text: 'some new text' };
    const newPage = Object.assign({}, cutPageForEdit(newSource));

    const startState = {...initialState,
      admin: {...initialState.admin,
        editPage: {...initialState.admin.editPage,
          dataSource: initSource,
          data: newPage,
          url: pageUrl
        }
      }
    };

    const responseSuccess = {
      success: true,
      page: newSource
    };
    const actions = [
      { type: types.UPDATE_ADMIN_PAGE_START },
      {
        type: types.UPDATE_ADMIN_PAGE_END,
        dataSource: newSource,
        data: newPage
      },
      getNotificationAction('EditPage.success', null)
    ];
    const states = [
      {...startState,
        admin: {...startState.admin,
          editPage: {...startState.admin.editPage,
            pending: true
          }
        }
      },
      {...startState,
        admin: {...startState.admin,
          editPage: {...startState.admin.editPage,
            pending: false,
            dataSource: newSource
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t update page. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: types.UPDATE_ADMIN_PAGE_END,
        dataSource: initSource,
        data: newPage
      },
      getNotificationAction(null, responseFail)
    ];
    const statesFail = [
      states[0],
      {...startState,
        admin: {...startState.admin,
          editPage: {...startState.admin.editPage,
            pending: false,
            dataSource: initSource,
            data: newPage
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
        .patch('/api/pages?url=' + pageUrl)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.updatePageAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(startState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(startState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .patch('/api/pages?url=' + pageUrl)
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.updatePageAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function changePageData', () => {

    const testChangePageData = (key, value) => {
      const pageSource = Object.assign({}, pages[0]);
      const page = Object.assign({}, cutPageForEdit(pageSource));

      const stateStart = {...initialState,
        admin: {...initialState.admin,
          editPage: {...initialState.admin.editPage,
            dataSource: pageSource,
            data: page
          }
        }
      };

      const stateEnd = {...stateStart,
        admin: {...stateStart.admin,
          editPage: {...stateStart.admin.editPage,
            data: {...stateStart.admin.editPage.data,
              [key]: value
            }
          }
        }
      };

      const action = {
        type: types.CHANGE_PAGE_DATA,
        payload: stateEnd.admin.editPage.data
      };

      it(`should change ${key}, reducer`, () =>
        expect(reducer(stateStart, action)).toEqual(stateEnd)
      );

      it(`should change ${key}, action`, () => {
        const store = mockStore(stateStart);
        store.dispatch(actionsCreators.changePageData({[key]: value}));
        expect(store.getActions()).toEqual([action]);
      });
    };

    testChangePageData('title', 'new title of page');
    testChangePageData('text', 'new text of page');
  });

  describe('function resetPage', () => {

    let sourcePage = Object.assign({}, pages[0]);
    delete sourcePage.url;

    let editedPage = Object.assign({}, sourcePage);
    editedPage.text = 'new text';

    const stateStart = {...initialState,
      admin: {...initialState.admin,
        editPage: {...initialState.admin.editPage,
          dataSource: sourcePage,
          data: editedPage
        }
      }
    };

    const stateEnd = Object.assign({}, stateStart);
    stateEnd.admin.editPage.data = sourcePage;

    const action = {
      type: types.CHANGE_PAGE_DATA,
      payload: stateEnd.admin.editPage.dataSource
    };

    it('should work, reducer', () =>
      expect(reducer(stateStart, action)).toEqual(stateEnd)
    );

    it('should work, action', () => {
      const store = mockStore(stateStart);
      store.dispatch(actionsCreators.resetPage());
      expect(store.getActions()).toEqual([action]);
    });
  });

  describe('function removePageAsync', () => {

    const pageUrl = pages[0].url;
    const startState = {...initialState,
      admin: {...initialState.admin,
        editPage: {...initialState.admin.editPage,
          url: pageUrl
        }
      }
    };

    const responseSuccess = { success: true };
    const actions = [
      { type: types.DELETE_PAGE_START },
      { type: types.DELETE_PAGE_END },
      getNotificationAction('EditPage.successful_remove', null)
    ];
    const states = [
      {...initialState,
        admin: {...initialState.admin,
          editPage: {...initialState.admin.editPage,
            removePending: true
          }
        }
      },
      {...initialState,
        admin: {...initialState.admin,
          editPage: {...initialState.admin.editPage,
            removePending: false
          }
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t delete page. Database error'
    };
    const actionsFail = [
      actions[0],
      actions[1],
      getNotificationAction(null, responseFail)
    ];
    const statesFail = states;

    it('should work, reducer', () => {
      expect(reducer(initialState, actions[0])).toEqual(states[0]);
      expect(reducer(initialState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .delete('/api/pages?url=' + pageUrl)
        .reply(200, responseSuccess);

      return store
        .dispatch(actionsCreators.removePageAsync())
        .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      const store = mockStore(startState);

      nock('http://localhost')
        .delete('/api/pages?url=' + pageUrl)
        .reply(200, responseFail);

      return store
        .dispatch(actionsCreators.removePageAsync())
        .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });
});
