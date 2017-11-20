const {expect} = require('chai');

const {appPath, setupComponent, languages} = require('../_shared.js');
const Home = require(appPath + 'components/Home').default;

describe('Testing Home Component.', () => {

  it('should show component correctly', () => {
    const {wrapper} = setupComponent(Home);

    expect(wrapper.find('[data-test-id="Home"]').exists()).equal(true);

    const emTitleId = '[data-test-id="em-title"]';
    const i18nEmTitleId = 'Home.search_title_em';
    expect(wrapper.find(emTitleId).exists()).equal(true);
    expect(wrapper.find(emTitleId).children().props().id).equal(i18nEmTitleId);

    const h1TitleId = '[data-test-id="span-title"]';
    const i18nH1TitleId = 'Home.search_title_h1';
    expect(wrapper.find(h1TitleId).exists()).equal(true);
    expect(wrapper.find(h1TitleId).children().props().id).equal(i18nH1TitleId);

    const searchInputComponentId = '[data-test-id="SearchInput"]';
    const searchResultsComponentId = '[data-test-id="SearchResults"]';
    expect(wrapper.find(searchInputComponentId).exists()).equal(true);
    expect(wrapper.find(searchResultsComponentId).exists()).equal(true);

    wrapper.unmount();
  });

  it('should exists all i18n-texts for the component', () => {
    languages.forEach(lang => {
      const i18n = require(appPath + 'i18n/' + lang.id);
      [
        'Home.search_title_em',
        'Home.search_title_h1'
      ].forEach(elem => expect(i18n.hasOwnProperty(elem)).equal(true));
    });
  });
});
