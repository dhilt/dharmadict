global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  initialState,
  languages,
  _appPath
} = require('../../../_shared.js');

const Header = require('../' + _appPath + 'components/common/Header').default;

describe('Testing Login, presentational Component.', () => {

  const checkShowLogin = (modalIsOpen, login, password, pending) => {
    languages.forEach(lang => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id,
          languages
        },
        auth: { ...initialState.auth,
          loggedIn: false,
          userInfo: { ...initialState.auth.userInfo,
            requested: true,
            pending: false
          },
          modalIsOpen,
          pending,
          login,
          password
        }
      };
      const {wrapper} = setupComponent(Header, _initialState);
      const i18n = require('../' + _appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="Login"]'));
      checkWrap(wrapper.find('[data-test-id="Login.header_button_log_in"]'), {
        text: i18n['Login.header_button_log_in']
      });

      checkWrap(wrapper.find('[data-test-id="Login.modal"]'), {
        contentLabel: 'Log In Dialog',
        isOpen: modalIsOpen
      });

      if (!modalIsOpen) {
        checkWrap(wrapper.find('[data-test-id="Login.title_log_in"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="login-modal-content"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.form"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.form-login"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.input-login"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.form-password"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.input-password"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.button_do_login"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.button_do_login_text"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Login.button_cancel"]'), { length: 0 });
      }

      if (modalIsOpen) {
        // checkWrap(wrapper.find('[data-test-id="Login.title_log_in"]'), {
        //   text: i18n['Login.please_log_in']
        // });  // should work
      }

      wrapper.unmount();
    });
  };

  it(`should show the component with closed modal`,
    () => checkShowLogin(false, '', '', false)
  );

  it(`should show the component with opened modal`,
    () => checkShowLogin(true, '', '', false)
  );

  it(`should show the component with entered login`,
    () => checkShowLogin(true, 'login', '', false)
  );

  it(`should show the component with entered password`,
    () => checkShowLogin(true, '', 'password', false)
  );

  it(`should show the component with entered login and password`,
    () => checkShowLogin(true, 'login', 'password', false)
  );

  it(`should show the component sending request`,
    () => checkShowLogin(true, 'login', 'password', true)
  );
});
