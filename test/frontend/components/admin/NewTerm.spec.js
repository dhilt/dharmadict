global.window.localStorage = {};

const {setupComponent, checkWrap, initialState, languages, _appPath} = require('../../_shared.js');

const NewTerm = require(_appPath + 'components/admin/NewTerm').default;

describe('Testing NewTerm Component.', () => {

  const checkShowNewTerm = (term, lang, pending) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: lang,
        languages
      },
      admin: { ...initialState.admin,
        newTerm: { ...initialState.admin.newTerm,
          wylie: term.wylie,
          sanskrit: term.sanskrit,
          pending
        }
      }
    };
    const wrapper = setupComponent(NewTerm, _initialState);
    const i18n = require(_appPath + 'i18n/' + lang);

    checkWrap(wrapper.find('[data-test-id="NewTerm"]'));

    checkWrap(wrapper.find('[data-test-id="title"]'), {
      text: i18n['NewTerm.title_new_term']
    });

    checkWrap(wrapper.find('[data-test-id="main-form"]'), {
      className: 'col-md-6'
    });

    checkWrap(wrapper.find('[data-test-id="form-wylie"]'), {
      className: 'form-group'
    });

    checkWrap(wrapper.find('[data-test-id="input-wylie"]'), {
      className: 'form-control',
      placeholder: 'wylie',
      value: term.wylie,
      name: 'wylie',
      type: 'text'
    });

    languages.forEach((language, languageIndex) => {

      checkWrap(wrapper.find('[data-test-id="form-sanskrit"]').at(languageIndex), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="input-sanskrit"]').at(languageIndex), {
        placeholder: `sanskrit_${language.id} (${language.name})`,
        className: 'form-control',
        name: language.id,
        type: 'text'
      });
    });

    checkWrap(wrapper.find('[data-test-id="button-group"]'), {
      className: 'form-group'
    });

    checkWrap(wrapper.find('button[data-test-id="button-save"]'), {
      disabled: !term.wylie || pending
        || (Object.keys(term.sanskrit).reduce(
          (result, key) => result + !!term.sanskrit[key], 0) !== languages.length),
      text: i18n['Common.save'],
      className: pending ? 'loader' : '',
      type: 'button'
    });

    checkWrap(wrapper.find('a[data-test-id="button-cancel"]'), {
      text: i18n['Common.cancel']
    });

    wrapper.unmount();
  };

  let term = {
    wylie: 'wylie',
    sanskrit: {}
  };

  languages.forEach(lang =>
    term.sanskrit[`sanskrit_${lang.id}`] = `${lang.id} sanskrit`
  );

  languages.forEach(lang => {

    it(`should show the component`,
      () => checkShowNewTerm(term, lang.id, false)
    );

    it(`should show the component sending request`,
      () => checkShowNewTerm(term, lang.id, true)
    );

    const termWithoutWylie = {
      wylie: '',
      sanskrit: term.sanskrit
    };

    it(`should show the component blocking button for sending`,
      () => checkShowNewTerm(termWithoutWylie, lang.id, false)
    );

    let termWithNoFullSanskrit = {
      wylie: '',
      sanskrit: term.sanskrit
    };
    termWithNoFullSanskrit.sanskrit[`sanskrit_${languages[0].id}`] = '';

    it(`should show the component blocking button for sending`,
      () => checkShowNewTerm(termWithNoFullSanskrit, lang.id, false)
    );
  });
});
