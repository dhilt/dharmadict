const NotFound = require('../../../app/components/NotFound').default;
const {setupComponent, checkWrap, initialState, languages} = require('../_shared.js');

describe('Testing NotFound Component.', () => {

  languages.forEach(lang => {
    it('should show component', () => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        }
      };
      const wrapper = setupComponent(NotFound, _initialState);
      const i18n = require('../../../app/i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="NotFound"]'));

      checkWrap(wrapper.find('[data-test-id="heading"]'), {
        text: i18n['NotFound.main_text']
      });

      checkWrap(wrapper.find('a[data-test-id="back_link"]'), {
        text: i18n['NotFound.go_home'],
        className: 'btn'
      });

      wrapper.unmount();
    });
  });
});
