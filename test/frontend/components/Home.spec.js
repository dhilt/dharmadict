const React = require('react');
const {expect} = require('chai');

const {appPath, languages, mountWithIntl} = require('../_shared.js');
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

  const arrIntlStringsId = [
    ['[data-test-id="span-title"]', 'Home.search_title_h1'],
    ['[data-test-id="em-title"]', 'Home.search_title_em']
  ];

  languages.forEach(lang => {
    const i18n = require(appPath + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component (${lang.id})`, () =>
      arrIntlStringsId.forEach(couple =>
        expect(i18n.hasOwnProperty(couple[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<Home />, lang.id);

      arrIntlStringsId.forEach(couple =>
        expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]])
      );

      wrapper.unmount();
    });
  });
});
