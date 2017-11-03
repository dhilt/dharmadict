global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  defaultLang,
  translators,
  languages,
  _appPath
} = require('../../_shared.js');

const EditPasswordByTranslator = require(_appPath + 'components/translator/EditPasswordByTranslator').default;

describe('Testing EditPasswordByTranslator Component.', () => {

  const checkShowEditPasswordByTranslator = (translator, payload, error, pending) => {
    languages.forEach(lang => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        },
        translator: { ...initialState.translator,
          editPassword: { ...initialState.translator.editPassword,
            currentPassword: payload.currentPassword ? payload.currentPassword : '',
            newPassword: payload.newPassword ? payload.newPassword : '',
            confirmPassword: payload.confirmPassword ? payload.confirmPassword : '',
            error,
            pending
          }
        }
      };
      const _props = {
        params: {
          id: translator ? translator.id : null
        },
        routeParams: {
          id: translator ? translator.id : null
        }
      };
      const {wrapper} = setupComponent(EditPasswordByTranslator, _initialState, _props);
      const i18n = require(_appPath + 'i18n/' + lang.id);
      const {currentPassword, newPassword, confirmPassword} = payload;

      checkWrap(wrapper.find('[data-test-id="EditPasswordByTranslator"]'));

      checkWrap(wrapper.find('[data-test-id="main-form"]'), {
        className: 'col-md-6'
      });

      checkWrap(wrapper.find('[data-test-id="title"]'), {
        text: i18n['EditPasswordByTranslator.title'].replace('{id}', _props.params.id)
      });

      checkWrap(wrapper.find('[data-test-id="group-current-pass"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-current-pass"]'), {
        text: i18n['EditPasswordByTranslator.current_password']
      });

      checkWrap(wrapper.find('[data-test-id="input-current-pass"]'), {
        value: currentPassword,
        className: 'form-control',
        type: 'password'
      });

      checkWrap(wrapper.find('[data-test-id="group-new-pass"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-new-pass"]'), {
        text: i18n['EditPasswordByTranslator.new_password'] +
              i18n['EditPasswordByTranslator.new_password_hint']
      });

      checkWrap(wrapper.find('[data-test-id="hint-new-pass"]'), {
        text: i18n['EditPasswordByTranslator.new_password_hint'],
        className: 'hint'
      });

      checkWrap(wrapper.find('[data-test-id="input-new-pass"]'), {
        value: newPassword,
        className: 'form-control',
        type: 'password'
      });

      checkWrap(wrapper.find('[data-test-id="group-confirm-pass"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-confirm-pass"]'), {
        text: i18n['EditPasswordByTranslator.new_confirm_password']
      });

      checkWrap(wrapper.find('[data-test-id="input-confirm-pass"]'), {
        value: confirmPassword,
        className: 'form-control',
        type: 'password'
      });

      checkWrap(wrapper.find('[data-test-id="group-button"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="btn-save"]'), {
        disabled: pending || !currentPassword || !newPassword || !confirmPassword ||
          (newPassword !== confirmPassword) || (newPassword < 6),
        text: i18n['Common.save'],
        className: 'btn btn-primary'
      });

      checkWrap(wrapper.find('[data-test-id="btn-reset"]'), {
        text: i18n['Common.reset'],
        className: 'btn btn-default'
      });

      checkWrap(wrapper.find('a[data-test-id="btn-cancel"]'), {
        text: i18n['Common.cancel']
      });

      wrapper.unmount();
    });
  };

  const defaultTranslator = translators[0];
  let payload = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  it('should show empty component',
    () => checkShowEditPasswordByTranslator(defaultTranslator, payload, null, false)
  );

  payload.currentPassword = 'current_password';
  it('should show component with edited current password (current)',
    () => checkShowEditPasswordByTranslator(defaultTranslator, payload, null, false)
  );

  payload.newPassword = 'new_password';
  it('should show component with edited new password (new)',
    () => checkShowEditPasswordByTranslator(defaultTranslator, payload, null, false)
  );

  payload.confirmPassword = 'new_password_';
  it('should show component with edited confirm password (button disabled, password does not match)',
    () => checkShowEditPasswordByTranslator(defaultTranslator, payload, null, false)
  );

  payload.confirmPassword = 'new';
  payload.newPassword = 'new';
  it('should show component with edited new and confirm password (button disabled, password too short)',
    () => checkShowEditPasswordByTranslator(defaultTranslator, payload, null, false)
  );

  payload.confirmPassword = 'new_password';
  payload.newPassword = 'new_password';
  it('should show component with edited new and confirm password, ready for request',
    () => checkShowEditPasswordByTranslator(defaultTranslator, payload, null, false)
  );

  it('should show component with edited new and confirm password, ready for request',
    () => checkShowEditPasswordByTranslator(defaultTranslator, payload, null, true)
  );

  it('should correctly handle actions on component', () => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: defaultLang
      },
      translator: { ...initialState.translator,
        editPassword: { ...initialState.translator.editPassword,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }
    };
    const mockId = 'ID';
    const _props = {
      params: { id: mockId },
      routeParams: { id: mockId },
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(EditPasswordByTranslator, _initialState, _props);
    const i18n = require(_appPath + 'i18n/' + defaultLang);

    let actionsCount = 0;
    checkWrapActions(store, actionsCount);

    wrapper.find('[data-test-id="input-current-pass"]').props().onChange({target: {value: 'pass'}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="input-new-pass"]').props().onChange({target: {value: 'new_pass'}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="input-confirm-pass"]').props().onChange({target: {value: 'new_pass'}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('button[data-test-id="btn-save"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('button[data-test-id="btn-reset"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);
  });
});
