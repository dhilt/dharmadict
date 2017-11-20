const {expect} = require('chai');

const {appPath, setupComponent} = require('../_shared.js');
const App = require(appPath + 'components/App').default;

describe('Testing App Component.', () => {

  it('should show component correctly', () => {
    const {wrapper} = setupComponent(App);

    expect(wrapper.find('[data-test-id="App"]').exists()).equal(true);
    expect(wrapper.find('[data-test-id="Notifier"]').exists()).equal(true);
    expect(wrapper.find('[data-test-id="Header"]').exists()).equal(true);

    wrapper.unmount();
  });
});
