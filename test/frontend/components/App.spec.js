global.window.localStorage = {};
const {expect} = require('chai');

const App = require('../../../app/components/App').default;
const {setupComponent} = require('../_shared.js');

describe('Testing App Component.', () => {

  it('should show component', () => {
    const wrapper = setupComponent(App);

    expect(wrapper.find('div.wrapper')).to.exist;
    expect(wrapper.find('div.container')).to.exist;
    expect(wrapper.find('div.alert-column')).to.exist;
    expect(wrapper.find('div.nav')).to.exist;
    expect(wrapper.find('div.nav.nav__wrapper')).to.exist;
    expect(wrapper.find('div.nav.nav__wrapper.languages-bar-header')).to.exist;
  });
});
