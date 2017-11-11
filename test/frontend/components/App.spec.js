global.window.localStorage = {};

const {setupComponent, checkWrap, appPath} = require('../_shared.js');

const App = require(appPath + 'components/App').default;

describe('Testing App Component.', () => {

  it('should show component', () => {
    const {wrapper} = setupComponent(App);

    checkWrap(wrapper.find('[data-test-id="App"]'));
    checkWrap(wrapper.find('[data-test-id="Notifier"]'));
    checkWrap(wrapper.find('[data-test-id="Header"]'));

    wrapper.unmount();
  });
});
