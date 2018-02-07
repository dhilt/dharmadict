const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  getAppPath,
  shallow
} = require('../../../_shared.js');

const Logout = require(getAppPath(3) + 'components/common/header/Logout').default;

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
});
