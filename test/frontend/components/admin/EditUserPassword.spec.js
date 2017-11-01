global.window.localStorage = {};
const {expect} = require('chai');

const EditUserPassword = require('../../../../app/components/admin/EditUserPassword').default;
const {setupComponent, checkWrap, initialState, languages} = require('../../_shared.js');

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
      const wrapper = setupComponent(EditUserPassword, _initialState, _props);
      const i18n = require('../../../../app/i18n/' + lang.id);

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
        text: i18n['EditUser.button_save'],
        className: 'btn btn-primary'
      });

      checkWrap(wrapper.find('[data-test-id="btn-reset"]'), {
        text: i18n['EditUser.button_reset_changes'],
        className: 'btn btn-default'
      });

      checkWrap(wrapper.find('a[data-test-id="btn-cancel"]'), {
        text: i18n['EditUser.button_cancel']
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
});
