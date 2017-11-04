const {setupComponent, checkWrap, initialState, languages, _appPath} = require('../../_shared.js');
const LoadingIndicator = require(_appPath + 'components/common/LoadingIndicator').default;

describe('Testing LoadingIndicator Component.', () => {

  languages.forEach(lang => {
    it(`should show the ${lang.id}component`, () => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        }
      };
      const {wrapper} = setupComponent(LoadingIndicator, _initialState);
      const i18n = require(_appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="LoadingIndicator"]'), {
        text: i18n['LoadingIndicator.main_text']
      });

      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.sk-fading-circle"]'), {
        className: 'sk-fading-circle'
      });

      const countOfCircles = 12;
      for (let i = 1; i <= countOfCircles; i++) {
        checkWrap(wrapper.find(`[data-test-id="LoadingIndicator.circle-${i}"]`), {
          className: `sk-circle${i} sk-circle`
        });
      }

      wrapper.unmount();
    });
  });
});
