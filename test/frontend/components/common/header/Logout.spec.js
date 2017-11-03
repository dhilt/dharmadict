global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  initialState,
  languages,
  users,
  _appPath
} = require('../../../_shared.js');

const Header = require('../' + _appPath + 'components/common/Header').default;

describe('Testing Logout, presentational Component.', () => {

  const checkShowLogout = (userLooking) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: userLooking.language,
        languages
      },
      auth: { ...initialState.auth,
        loggedIn: true,
        userInfo: { ...initialState.auth.userInfo,
          data: userLooking
        }
      }
    };
    const {wrapper} = setupComponent(Header, _initialState);
    const i18n = require('../' + _appPath + 'i18n/' + userLooking.language);

    checkWrap(wrapper.find('[data-test-id="Logout"]'));
    checkWrap(wrapper.find('[data-test-id="Logout.button_logout"]'), {
      text: i18n['Logout.button_logout']
    });

    wrapper.unmount();
  };

  users.forEach(user =>
    it(`should show the ${user.language}-component for authorized user`,
      () => checkShowLogout(user)
    )
  );
});
