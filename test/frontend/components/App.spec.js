const React = require('react');
const {expect} = require('chai');

const {appPath, mountWithIntl} = require('../_shared.js');
const App = require(appPath + 'components/App').default;

describe('Testing App Component.', () => {

  it('should show component correctly', () => {
    const wrapper = mountWithIntl(<App />);

    const appId = '[data-test-id="App"]';
    expect(wrapper.find(appId).exists()).equal(true);

    const notifierId = '[data-test-id="Notifier"]';
    const headerId = '[data-test-id="Header"]';
    expect(wrapper.find(notifierId).exists()).equal(true);
    expect(wrapper.find(headerId).exists()).equal(true);

    wrapper.unmount();
  });
});
