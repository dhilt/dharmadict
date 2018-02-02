const React = require('react');
const {expect} = require('chai');

const {appPath, shallow} = require('../_shared.js');
const NotFound = require(appPath + 'components/NotFound').default;

describe('Testing NotFound Component.', () => {

  it('should show component correctly', () => {
    const wrapper = shallow(<NotFound />);

    const notFoundId = '[data-test-id="NotFound"]';
    expect(wrapper.find(notFoundId).exists()).equal(true);

    wrapper.unmount();
  });
});
