const {setupComponent, checkWrap, appPath} = require('../_shared.js');

const About = require(appPath + 'components/About').default;

describe('Testing About Component.', () => {
  beforeEach(() => console.error = jest.fn());

  it('should show component', () => {
    const wrapper = setupComponent(About);

    checkWrap(wrapper.find('[data-test-id="About"]'));

    wrapper.unmount();
  });
});
