global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  languages,
  users,
  _appPath
} = require('../../../_shared.js');

const Logout = require('../' + _appPath + 'components/common/header/Logout').default;

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
    const {wrapper} = setupComponent(Logout, _initialState);
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

  it('should correctly handle actions on component', () => {
    const defaultUser = users[0];
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: defaultUser.language,
        languages
      },
      auth: { ...initialState.auth,
        loggedIn: true,
        userInfo: { ...initialState.auth.userInfo,
          data: defaultUser
        }
      }
    };
    const _props = {
      doLogout: () => null
    };
    const {wrapper} = setupComponent(Logout, _initialState, _props);

    wrapper.find('[data-test-id="Logout.button_logout"]').first().props().onClick({preventDefault: () => {}});
  });
});
