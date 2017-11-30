const React = require('react');
const {expect} = require('chai');

const {appPath, shallow} = require('../_shared.js');
const About = require(appPath + 'components/About').default;

describe('Testing About Component.', () => {

  it('should show component correctly', () => {
    const wrapper = shallow(<About />);

    const aboutArticleId = '[data-test-id="About"]';
    expect(wrapper.find(aboutArticleId).exists()).equal(true);

    wrapper.unmount();
  });
});
