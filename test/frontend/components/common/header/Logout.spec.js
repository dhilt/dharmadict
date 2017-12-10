const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  mountWithIntl,
  languages,
  _appPath,
  shallow
} = require('../../../_shared.js');

const Logout = require('../' + _appPath + 'components/common/header/Logout').default;

describe('Testing Logout Component.', () => {

  const props = {
    doLogout: sinon.spy()
  };

  const LogoutId = '[data-test-id="Logout"]';
  const btnLogoutId = '[data-test-id="Logout.button_logout"]';

  it('should correctly handle actions', () => {
    const wrapper = shallow(<Logout {...props} />);

    wrapper.find(btnLogoutId).simulate('click', {
      preventDefault: () => true
    });
    expect(props.doLogout.calledOnce).equal(true);

    wrapper.unmount();
  });

  it('should show component correctly', () => {
    const wrapper = shallow(<Logout {...props} />);

    expect(wrapper.find(LogoutId).exists()).equal(true);
    expect(wrapper.find(btnLogoutId).exists()).equal(true);

    wrapper.unmount();
  });

  const intlStringsId = [btnLogoutId, 'Logout.button_logout'];

  languages.forEach(lang => {
    const i18n = require('../' + _appPath + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component (${lang.id})`, () => {
      expect(i18n.hasOwnProperty(intlStringsId[1])).equal(true);
    });

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<Logout {...props} />, lang.id);

      expect(wrapper.find(intlStringsId[0]).first().text()).equal(i18n[intlStringsId[1]]);

      wrapper.unmount();
    });
  });
});
