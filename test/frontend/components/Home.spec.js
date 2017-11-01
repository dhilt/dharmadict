global.window.localStorage = {};

const Home = require('../../../app/components/Home').default;
const {setupComponent, checkWrap, initialState, languages} = require('../_shared.js');

describe('Testing Home Component.', () => {

  languages.forEach(lang => {
    it(`should show component on ${lang.id} language`, () => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        }
      };
      const wrapper = setupComponent(Home, _initialState);
      const i18n = require('../../../app/i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="Home"]'), {
        className: 'row'
      });

      checkWrap(wrapper.find('[data-test-id="div-logo"]'), {
        className: 'col-md-2'
      });

      checkWrap(wrapper.find('[data-test-id="img-logo"]'), {
        className: 'logo'
      });

      checkWrap(wrapper.find('[data-test-id="title-md-10"]'), {
        className: 'col-md-10'
      });

      checkWrap(wrapper.find('[data-test-id="header-row"]'), {
        className: 'row header-row'
      });

      checkWrap(wrapper.find('[data-test-id="title-md-12"]'), {
        className: 'col-md-12'
      });

      checkWrap(wrapper.find('[data-test-id="full-title"]'), {
        text: i18n['Home.search_title_em'] + i18n['Home.search_title_h1']
      });

      checkWrap(wrapper.find('[data-test-id="em-title"]'), {
        text: i18n['Home.search_title_em']
      });

      checkWrap(wrapper.find('[data-test-id="span-title"]'), {
        text: i18n['Home.search_title_h1']
      });

      checkWrap(wrapper.find('[data-test-id="search-row"]'), {
        className: 'row search-row'
      });

      checkWrap(wrapper.find('[data-test-id="search-md-12"]'), {
        className: 'col-md-12'
      });

      checkWrap(wrapper.find('[data-test-id="SearchInput"]'));
      // further tests in "test/frontend/components/search/SearchInput"

      checkWrap(wrapper.find('[data-test-id="SearchResults"]'));
      // further tests in "test/frontend/components/search/SearchResults"
    });
  });
});
