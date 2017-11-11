const {setupComponent, checkWrap, initialState, languages, appPath} = require('../_shared.js');

const NotFound = require(appPath + 'components/NotFound').default;

describe('Testing NotFound Component.', () => {

  languages.forEach(lang => {
    it('should show component', () => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        }
      };
      const {wrapper} = setupComponent(NotFound, _initialState);
      const i18n = require(appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="NotFound"]'));

      checkWrap(wrapper.find('[data-test-id="heading"]'), {
        text: i18n['NotFound.main_text']
      });

      checkWrap(wrapper.find('[data-test-id="back_link"]').first(), {
        text: i18n['NotFound.go_home']
      });

      wrapper.unmount();
    });
  });
});
