const {
  setupComponent,
  checkWrap,
  initialState,
  languages,
  users,
  _appPath
} = require('../../_shared.js');

const Header = require(_appPath + 'components/common/Header').default;

describe('Testing Header Component.', () => {

  const checkShowHeader = (userLooking, pending, langId) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: userLooking ? userLooking.language : langId,
        languages
      },
      auth: { ...initialState.auth,
        loggedIn: userLooking ? true : false,
        userInfo: { ...initialState.auth.userInfo,
          data: userLooking,
          pending
        }
      }
    };
    const {wrapper} = setupComponent(Header, _initialState);
    const i18n = require(_appPath + 'i18n/' + _initialState.common.userLanguage);

    checkWrap(wrapper.find('[data-test-id="Header"]'), {
      className: 'nav'
    });

    checkWrap(wrapper.find('[data-test-id="Header.nav"]'), {
      className: 'nav__wrapper'
    });

    checkWrap(wrapper.find('[data-test-id="Header.about_project"]').first(), {
      text: i18n['Header.about_project']
    });

    checkWrap(wrapper.find('[data-test-id="Languages"]'), {
      className: 'languages-bar-header'
    });

    if (userLooking) {

      checkWrap(wrapper.find('[data-test-id="Header.navButtons-loggedIn"]'));

      checkWrap(wrapper.find('[data-test-id="Header.link_to_user"]').first(), {
        text: userLooking.name
      });

      checkWrap(wrapper.find('[data-test-id="Header.Logout"]'));

      if (userLooking.role === 'admin') {
        checkWrap(wrapper.find('[data-test-id="Header.link_create_term"]').first(), {
          text: i18n['Header.create_new_term']
        })
      } else {
        checkWrap(wrapper.find('[data-test-id="Header.link_create_term"]'), {
          length: 0
        })
      }
    } else {
      checkWrap(wrapper.find('[data-test-id="Header.navButtons-loggedIn"]'), { length: 0 });
      checkWrap(wrapper.find('[data-test-id="Header.link_to_user"]'), { length: 0 });
      checkWrap(wrapper.find('[data-test-id="Header.Logout"]'), { length: 0 });
      checkWrap(wrapper.find('[data-test-id="Header.link_create_term"]'), { length: 0 });
    }

    if (!userLooking) {

      checkWrap(wrapper.find('[data-test-id="Header.navButtons-notLoggedIn"]'));

      if (pending) {

        checkWrap(wrapper.find('[data-test-id="Header.LoadingButton"]'), {
          className: 'btn--nav'
        })
      } else {
        checkWrap(wrapper.find('[data-test-id="Header.LoadingButton"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="Header.Login"]'));
      }
    } else {
      checkWrap(wrapper.find('[data-test-id="Header.navButtons-notLoggedIn"]'), { length: 0 })
    }

    wrapper.unmount();
  };

  languages.forEach(lang => {
    it(`should show the ${lang.id}-component sending request`,
      () => checkShowHeader(null, true, lang.id)
    );

    it(`should show the ${lang.id}-component for non-authorized user`,
      () => checkShowHeader(null, false, lang.id)
    );
  });

  users.forEach(user =>
    it(`should show the ${user.language}-component for authorized user`,
      () => checkShowHeader(user, false)
    )
  );
});
