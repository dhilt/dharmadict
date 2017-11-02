global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  initialState,
  languages,
  _appPath
} = require('../../../_shared.js');

const Languages = require('../' + _appPath + 'components/common/header/Languages').default;

describe('Testing Languages Component.', () => {

  languages.forEach(lang => {
    it(`should show the ${lang.id}-component`, () => {
      const _props = {
        userLanguage: lang.id,
        languages
      };
      const wrapper = setupComponent(Languages, initialState, _props);
      const i18n = require('../' + _appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="Languages"]'), {
        className: 'languages-bar-header'
      });

      checkWrap(wrapper.find('button[data-test-id="Languages.Dropdown"]'));

      checkWrap(wrapper.find('[data-test-id="Languages.title"]'));

      languages.forEach((_lang, langIndex) => {
        checkWrap(wrapper.find('[data-test-id="Languages.langItem"]').at(langIndex), {
          text: _lang.id + (langIndex < languages.length - 1 ? '/' : '')
        });

        checkWrap(wrapper.find('[data-test-id="Languages.MenuItem"]').at(langIndex + 2), {
          text: _lang.id + ' - ' + _lang.name
        });

        checkWrap(wrapper.find('[data-test-id="Languages.showLangId"]').at(langIndex), {
          // className: _lang.id === _props.userLanguage ? 'selected' : '',  // should work
          text: _lang.id
        });
      });

      wrapper.unmount();
    });
  });
});
