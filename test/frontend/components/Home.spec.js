const {setupComponent, checkWrap, initialState, languages, appPath} = require('../_shared.js');

const Home = require(appPath + 'components/Home').default;

describe('Testing Home Component.', () => {

  languages.forEach(lang => {
    it(`should show component on ${lang.id} language`, () => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        }
      };
      const {wrapper} = setupComponent(Home, _initialState);
      const i18n = require(appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="Home"]'));

      checkWrap(wrapper.find('[data-test-id="em-title"]'), {
        text: i18n['Home.search_title_em']
      });

      checkWrap(wrapper.find('[data-test-id="span-title"]'), {
        text: i18n['Home.search_title_h1']
      });

      checkWrap(wrapper.find('[data-test-id="SearchInput"]'));
      checkWrap(wrapper.find('[data-test-id="SearchResults"]'));

      wrapper.unmount();
    });
  });
});
