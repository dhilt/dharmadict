global.window.localStorage = {};
const {expect} = require('chai');

const Home = require('../../../app/components/Home').default;
const {setupComponent, defaultLang} = require('../_shared.js');

const i18n = require('../../../app/i18n/' + defaultLang);

describe('Testing Home Component.', () => {
  it('should show component', () => {
    const wrapper = setupComponent(Home);

    expect(wrapper.find('[data-test-id="Home"]').length).equal(1);
    expect(wrapper.find('[data-test-id="Home"]').hasClass('row')).equal(true);

    expect(wrapper.find('[data-test-id="div-logo"]').length).equal(1);
    expect(wrapper.find('[data-test-id="div-logo"]').hasClass('col-md-2')).equal(true);

    expect(wrapper.find('[data-test-id="img-logo"]').length).equal(1);
    expect(wrapper.find('[data-test-id="img-logo"]').hasClass('logo')).equal(true);

    expect(wrapper.find('[data-test-id="title-md-10"]').length).equal(1);
    expect(wrapper.find('[data-test-id="title-md-10"]').hasClass('col-md-10')).equal(true);

    expect(wrapper.find('[data-test-id="header-row"]').length).equal(1);
    expect(wrapper.find('[data-test-id="header-row"]').hasClass('row')).equal(true);
    expect(wrapper.find('[data-test-id="header-row"]').hasClass('header-row')).equal(true);

    expect(wrapper.find('[data-test-id="title-md-12"]').length).equal(1);
    expect(wrapper.find('[data-test-id="title-md-12"]').hasClass('col-md-12')).equal(true);

    const fullTitle = i18n['Home.search_title_em'] + i18n['Home.search_title_h1'];
    expect(wrapper.find('[data-test-id="full-title"]').length).equal(1);
    expect(wrapper.find('[data-test-id="full-title"]').text()).equal(fullTitle);

    const emTitle = i18n['Home.search_title_em'];
    expect(wrapper.find('[data-test-id="em-title"]').length).equal(1);
    expect(wrapper.find('[data-test-id="em-title"]').text()).equal(emTitle);

    const spanTitle = i18n['Home.search_title_h1'];
    expect(wrapper.find('[data-test-id="span-title"]').length).equal(1);
    expect(wrapper.find('[data-test-id="span-title"]').text()).equal(spanTitle);

    expect(wrapper.find('[data-test-id="search-row"]').length).equal(1);
    expect(wrapper.find('[data-test-id="search-row"]').hasClass('row')).equal(true);
    expect(wrapper.find('[data-test-id="search-row"]').hasClass('search-row')).equal(true);

    expect(wrapper.find('[data-test-id="search-md-12"]').length).equal(1);
    expect(wrapper.find('[data-test-id="search-md-12"]').hasClass('col-md-12')).equal(true);

    expect(wrapper.find('[data-test-id="SearchInput"]').length).equal(1);
    // further tests in "test/frontend/components/search/SearchInput"

    expect(wrapper.find('[data-test-id="SearchResults"]').length).equal(1);
    // further tests in "test/frontend/components/search/SearchResults"
  });
});
