global.window.localStorage = {};

const App = require('../../../app/components/App').default;
const {setupComponent, checkWrap} = require('../_shared.js');

describe('Testing App Component.', () => {

  it('should show component', () => {
    const wrapper = setupComponent(App);

    checkWrap(wrapper.find('[data-test-id="App"]'), {
      className: 'wrapper'
    });

    checkWrap(wrapper.find('[data-test-id="Notifier"]'));
    checkWrap(wrapper.find('[data-test-id="Header"]'));

    checkWrap(wrapper.find('[data-test-id="App.container"]'), {
      container: 'container'
    });

    wrapper.unmount();
  });
});
