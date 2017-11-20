const React = require('react');
const {expect} = require('chai');
const {shallow, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });

const {appPath} = require('../_shared.js');
const About = require(appPath + 'components/About').default;

describe('Testing AboutPage Component.', () => {

  it('should show component correctly', () => {
    const wrapper = shallow(<About />);

    expect(wrapper.find('[data-test-id="About"]').exists()).equal(true);

    wrapper.unmount();
  });
});
