const React = require('react');
const {expect} = require('chai');

const {
  mountWithIntl,
  initialState,
  defaultLang,
  defaultTranslator,
  defaultUser,
  getAppPath,
  admin
} = require('../../_shared.js');

const Header = require(getAppPath(2) + 'components/common/Header').default.WrappedComponent;

describe('Testing Header Component.', () => {

  const props = {
    authData: initialState.auth,
    common: {
      userLanguage: defaultLang
    }
  };

  const HeaderId = '[data-test-id="Header"]';
  const notLoggedInId = '[data-test-id="Header.navButtons-notLoggedIn"]';
  const LoadingBtnComponentId = '[data-test-id="Header.LoadingButton"]';
  const linkCreateTermId = '[data-test-id="Header.link_create_term"]';
  const linkCreatePageId = '[data-test-id="Header.link_create_page"]';
  const LanguagesComponentId = '[data-test-id="Header.Languages"]';
  const loggedInId = '[data-test-id="Header.navButtons-loggedIn"]';
  const linkToUserId = '[data-test-id="Header.link_to_user"]';
  const LogoutComponentId = '[data-test-id="Header.Logout"]';
  const LoginComponentId = '[data-test-id="Header.Login"]';

  it('should show component correctly', () => {
    const wrapper = mountWithIntl(<Header {...props} />);

    expect(wrapper.find(HeaderId).exists()).equal(true);
    expect(wrapper.find(LanguagesComponentId).exists()).equal(true);

    expect(wrapper.find(notLoggedInId).exists()).equal(true);
    expect(wrapper.find(LoginComponentId).exists()).equal(true);
    expect(wrapper.find(LoadingBtnComponentId).exists()).equal(false);
    expect(wrapper.find(LogoutComponentId).exists()).equal(false);
    expect(wrapper.find(linkCreateTermId).exists()).equal(false);
    expect(wrapper.find(linkCreatePageId).exists()).equal(false);
    expect(wrapper.find(loggedInId).exists()).equal(false);

    wrapper.setProps({...props,
      authData: {...props.authData,
        userInfo: {...props.authData.userInfo,
          pending: true
        }
      }
    });
    expect(wrapper.find(notLoggedInId).exists()).equal(true);
    expect(wrapper.find(LoadingBtnComponentId).exists()).equal(true);
    expect(wrapper.find(LogoutComponentId).exists()).equal(false);
    expect(wrapper.find(LoginComponentId).exists()).equal(false);
    expect(wrapper.find(linkCreateTermId).exists()).equal(false);
    expect(wrapper.find(linkCreatePageId).exists()).equal(false);
    expect(wrapper.find(loggedInId).exists()).equal(false);

    wrapper.setProps({...props,
      authData: {...props.authData,
        loggedIn: true,
        userInfo: {...props.authData.userInfo,
          data: defaultUser
        }
      }
    });
    expect(wrapper.find(loggedInId).exists()).equal(true);
    expect(wrapper.find(LogoutComponentId).exists()).equal(true);
    expect(wrapper.find(linkToUserId).first().text()).equal(defaultUser.name);
    expect(wrapper.find(linkToUserId).first().prop('to')).equal('/translator/' + defaultUser.id);
    expect(wrapper.find(LoadingBtnComponentId).exists()).equal(false);
    expect(wrapper.find(LoginComponentId).exists()).equal(false);
    expect(wrapper.find(linkCreateTermId).exists()).equal(false);
    expect(wrapper.find(linkCreatePageId).exists()).equal(false);
    expect(wrapper.find(notLoggedInId).exists()).equal(false);

    wrapper.setProps({...props,
      authData: {...props.authData,
        loggedIn: true,
        userInfo: {...props.authData.userInfo,
          data: admin
        }
      }
    });
    expect(wrapper.find(loggedInId).exists()).equal(true);
    expect(wrapper.find(linkCreateTermId).exists()).equal(true);
    expect(wrapper.find(linkCreatePageId).exists()).equal(true);
    expect(wrapper.find(LogoutComponentId).exists()).equal(true);
    expect(wrapper.find(linkToUserId).first().text()).equal(admin.name);
    expect(wrapper.find(LoadingBtnComponentId).exists()).equal(false);
    expect(wrapper.find(LoginComponentId).exists()).equal(false);
    expect(wrapper.find(notLoggedInId).exists()).equal(false);

    wrapper.setProps({...props,
      authData: {...props.authData,
        loggedIn: true,
        userInfo: {...props.authData.userInfo,
          data: defaultTranslator
        }
      }
    });
    expect(wrapper.find(loggedInId).exists()).equal(true);
    expect(wrapper.find(linkCreatePageId).exists()).equal(true);
    expect(wrapper.find(LogoutComponentId).exists()).equal(true);
    expect(wrapper.find(linkToUserId).first().text()).equal(defaultTranslator.name);
    expect(wrapper.find(linkCreateTermId).exists()).equal(false);
    expect(wrapper.find(LoadingBtnComponentId).exists()).equal(false);
    expect(wrapper.find(LoginComponentId).exists()).equal(false);
    expect(wrapper.find(notLoggedInId).exists()).equal(false);

    wrapper.unmount();
  });
});
