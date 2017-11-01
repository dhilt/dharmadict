const About = require('../../../app/components/About').default;
const {setupComponent, checkWrap} = require('../_shared.js');

describe('Testing About Component.', () => {
  beforeEach(() => console.error = jest.fn());

  it('should show component', () => {
    const wrapper = setupComponent(About);

    checkWrap(wrapper.find('[data-test-id="About"]'));

    wrapper.unmount();
  });
});
