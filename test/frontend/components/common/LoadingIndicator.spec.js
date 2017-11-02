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
      const wrapper = setupComponent(LoadingIndicator, _initialState);
      const i18n = require(_appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="LoadingIndicator"]'), {
        text: i18n['LoadingIndicator.main_text']
      });

      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.sk-fading-circle"]'), {
        className: 'sk-fading-circle'
      });

      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-1"]'), {
        className: 'sk-circle1 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-2"]'), {
        className: 'sk-circle2 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-3"]'), {
        className: 'sk-circle3 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-4"]'), {
        className: 'sk-circle4 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-5"]'), {
        className: 'sk-circle5 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-6"]'), {
        className: 'sk-circle6 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-7"]'), {
        className: 'sk-circle7 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-8"]'), {
        className: 'sk-circle8 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-9"]'), {
        className: 'sk-circle9 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-10"]'), {
        className: 'sk-circle10 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-11"]'), {
        className: 'sk-circle11 sk-circle'
      });
      checkWrap(wrapper.find('[data-test-id="LoadingIndicator.circle-12"]'), {
        className: 'sk-circle12 sk-circle'
      });

      wrapper.unmount();
    });
  });
});
