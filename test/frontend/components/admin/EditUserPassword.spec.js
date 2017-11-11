global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  languages,
  defaultLang,
  _appPath
} = require('../../_shared.js');

const EditUserPassword = require(_appPath + 'components/admin/EditUserPassword').default;

describe('Testing EditUserPassword Component.', () => {

  const checkShowEditUserPassword = (password, confirmPassword, pending) => {
    languages.forEach(lang => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        },
        admin: { ...initialState.admin,
          editUserPassword: { ...initialState.admin.editUserPassword,
            confirmPassword,
            password,
            pending
          }
        }
      };
      const id = 'NEW_USER_ID';
      const _props = { params: { id } };
      const {wrapper} = setupComponent(EditUserPassword, _initialState, _props);
      const i18n = require(_appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="EditUserPassword"]'));

      checkWrap(wrapper.find('[data-test-id="main-form"]'), {
        className: 'col-md-6'
      });

      checkWrap(wrapper.find('[data-test-id="title"]'), {
        text: i18n['EditUserPassword.title'].replace('{id}', id)
      });

      checkWrap(wrapper.find('[data-test-id="group-new-pass"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-new-pass"]'), {
        text: i18n['EditUserPassword.new_password'] + i18n['EditUserPassword.new_password_hint']
      });

      checkWrap(wrapper.find('[data-test-id="hint-new-pass"]'), {
        text: i18n['EditUserPassword.new_password_hint'],
        className: 'hint'
      });

      checkWrap(wrapper.find('[data-test-id="input-new-pass"]'), {
        className: 'form-control',
        type: 'password',
        value: password
      });

      checkWrap(wrapper.find('[data-test-id="group-confirm-pass"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-confirm-pass"]'), {
        text: i18n['EditUserPassword.new_password_confirm']
      });

      checkWrap(wrapper.find('[data-test-id="input-confirm-pass"]'), {
        className: 'form-control',
        value: confirmPassword,
        type: 'password'
      });

      checkWrap(wrapper.find('[data-test-id="group-button"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="btn-save"]'), {
        disabled: pending || !password || !confirmPassword
          || password !== confirmPassword || password.length < 6,
        text: i18n['Common.save'],
        className: 'btn btn-primary'
      });

      checkWrap(wrapper.find('[data-test-id="btn-reset"]'), {
        text: i18n['Common.reset'],
        className: 'btn btn-default'
      });

      checkWrap(wrapper.find('[data-test-id="btn-cancel"]').first(), {
        text: i18n['Common.cancel']
      });

      wrapper.unmount();
    });
  };

  it('should show component with data',
    () => checkShowEditUserPassword('password', 'password', false)
  );

  it('should show component without data with disabled button',
    () => checkShowEditUserPassword('', '', false)
  );

  it('should show component with disabled button (no "confirmPassword")',
    () => checkShowEditUserPassword('password', '', false)
  );

  it('should show component with disabled button (no "password")',
    () => checkShowEditUserPassword('', 'password', false)
  );

  it('should show component with disabled button (short password)',
    () => checkShowEditUserPassword('pass', 'pass', false)
  );

  it('should show component with disabled button (different passwords)',
    () => checkShowEditUserPassword('password', '_password', false)
  );

  it('should show component with disabled button (pending)',
    () => checkShowEditUserPassword('password', 'password', true)
  );

  it('should correctly handle actions on component', () => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: defaultLang
      },
      admin: { ...initialState.admin,
        editUserPassword: { ...initialState.admin.editUserPassword,
          confirmPassword: '',
          password: ''
        }
      }
    };
    const id = 'NEW_USER_ID';
    const _props = {
      params: { id },
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(EditUserPassword, _initialState, _props);

    let actionsCount = 1;  // component starts with the request
    checkWrapActions(store, actionsCount);

    wrapper.find('[data-test-id="input-new-pass"]').props().onChange({target: {value: 'pass'}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="input-confirm-pass"]').props().onChange({target: {value: 'pass'}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="btn-save"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="btn-reset"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);
  });
});
