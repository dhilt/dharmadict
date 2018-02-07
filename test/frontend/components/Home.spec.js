const React = require('react');
const {expect} = require('chai');

const {appPath, mountWithIntl} = require('../_shared.js');
const Home = require(appPath + 'components/Home').default;

describe('Testing Home Component.', () => {

  it('should show component correctly', () => {
    const wrapper = mountWithIntl(<Home />);

    const homeId = '[data-test-id="Home"]';
    expect(wrapper.find(homeId).exists()).equal(true);

    const searchInputId = '[data-test-id="SearchInput"]';
    const searchResultsId = '[data-test-id="SearchResults"]';
    expect(wrapper.find(searchInputId).exists()).equal(true);
    expect(wrapper.find(searchResultsId).exists()).equal(true);

    wrapper.unmount();
  });
});
