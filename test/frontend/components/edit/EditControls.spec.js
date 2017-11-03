global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  defaultLang,
  languages,
  _appPath
} = require('../../_shared.js');

const EditControls = require(_appPath + 'components/edit/EditControls').default;

describe('Testing EditControls Component.', () => {

  beforeEach(() => console.log = jest.fn());

  const checkShowEditControls = (pending, lang) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: lang,
      },
      edit: { ...initialState.edit,
        update: { ...initialState.edit.update,
          pending: pending
        }
      }
    };
    const {wrapper} = setupComponent(EditControls, _initialState);
    const i18n = require(_appPath + 'i18n/' + lang);

    checkWrap(wrapper.find('[data-test-id="EditControls"]'), {
      className: 'form-group form-inline'
    });

    checkWrap(wrapper.find('button[data-test-id="button-save-and-close"]'), {
      text: i18n['EditControls.button_save_and_close'],
      className: pending ? 'loader' : '',
      disabled: pending,
      type: 'button'
    });

    checkWrap(wrapper.find('button[data-test-id="button-save"]'), {
      text: i18n['EditControls.button_save'],
      className: pending ? 'loader' : '',
      disabled: pending,
      type: 'button'
    });

    checkWrap(wrapper.find('a[data-test-id="cancel-link"]'), {
      text: i18n['EditControls.button_reset'],
      className: 'cancel-link'
    });

    wrapper.unmount();
  };

  languages.forEach(lang => {

    it('should show component, that is sending the request',
      () => checkShowEditControls(true, lang.id)
    );

    it('should show component, that is not sending the request',
      () => checkShowEditControls(false, lang.id)
    );
  });

  it('should correctly handle actions on component with existing translations', () => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: defaultLang
      },
      edit: { ...initialState.edit,
        termName: 'termName',
        change: { meanings: [] }
      }
    };
    const _props = {
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(EditControls, _initialState, _props);
    const i18n = require(_appPath + 'i18n/' + defaultLang);

    let actionsCount = 0;
    checkWrapActions(store, actionsCount);

    wrapper.find('button[data-test-id="button-save-and-close"]').props().onClick({});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('button[data-test-id="button-save"]').props().onClick({});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="cancel-link"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);
  });
});
