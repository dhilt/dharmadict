global.window.localStorage = {};
const {expect} = require('chai');

const Term = require('../../../../app/components/search/Term').default;
const {setupComponent, initialState, terms, translators, languages} = require('../../_shared.js');

describe('Testing Term Component.', () => {

  const checkShowTerm = (selectedTerm, userRole, lang) => {
    const _initialState = { ...initialState,
      selected: { ...initialState.selected,
        term: selectedTerm
      },
      common: { ...initialState.common,
        userLanguage: lang,
        translators
      },
      auth: { ...initialState.auth,
        userInfo: { ...initialState.auth.userInfo,
          data: { ...initialState.auth.userInfo.data,
            role: userRole,
            id: userRole === 'translator' ? translators[1].id : ''
            // on case of editing by translator
          }
        }
      }
    };
    const wrapper = setupComponent(Term, _initialState);
    const i18n = require('../../../../app/i18n/' + lang);

    let _wrap = wrapper.find('[data-test-id="Term"]');
    expect(_wrap.length).equal(1);
    expect(_wrap.hasClass('term')).equal(true);

    _wrap = wrapper.find('[data-test-id="term-header"]');
    expect(_wrap.length).equal(1);
    expect(_wrap.hasClass('term-header')).equal(true);

    _wrap = wrapper.find('[data-test-id="wylie-header"]');
    expect(_wrap.length).equal(1);
    expect(_wrap.hasClass('wylie')).equal(true);
    expect(_wrap.text()).equal(selectedTerm.wylie);

    _wrap = wrapper.find('[data-test-id="sanskrit"]');
    let _sanskrit = i18n['Term.sanskrit_term'].replace(`{sanskrit_${lang}}`, '');
    _sanskrit += selectedTerm[`sanskrit_${lang}`];
    expect(_wrap.length).equal(1);
    expect(_wrap.hasClass('sanskrit')).equal(true);
    expect(_wrap.text()).equal(_sanskrit);

    _wrap = wrapper.find('[data-test-id="translation-list"]');
    expect(_wrap.length).equal(1);
    expect(_wrap.hasClass('translation-list')).equal(true);

    _wrap = wrapper.find('[data-test-id="translation"]');
    expect(_wrap.length).equal(selectedTerm.translations.length);

    selectedTerm.translations.forEach((translation, translationIndex) => {
      let _wrap = wrapper.find('[data-test-id="translation"]').at(translationIndex);
      expect(_wrap.length).equal(1);
      expect(_wrap.hasClass('translation')).equal(true);

      _wrap = wrapper.find('[data-test-id="wrap-translator-ref"]').at(translationIndex);
      expect(_wrap.length).equal(1);
      expect(_wrap.hasClass('wrap-translator-ref')).equal(true);

      _wrap = wrapper.find('a[data-test-id="link-translator"]').at(translationIndex);
      const translatorName = translators.find(e => e.id === translation.translatorId).name;
      expect(_wrap.hasClass('translator=ref'));
      // reference ?
      expect(_wrap.text()).equal(translatorName);

      if (userRole === 'admin' || translation.translatorId === _initialState.auth.userInfo.data.id) {
        let _wrap = wrapper.find('[data-test-id="link-to-edit"]').at(translationIndex);
        expect(_wrap.length).equal(1);

        _wrap = wrapper.find('[data-test-id="edit-icon"]').at(translationIndex);
        expect(_wrap.length).equal(1);
        expect(_wrap.hasClass('edit-icon')).equal(true);
      } else {
        // let _wrap = wrapper.find('[data-test-id="edit-icon"]');
        // expect(_wrap.length).equal(0);
      }
    });
  };

  const selectedTerm = terms[1];

  languages.forEach(lang =>
    ['user', 'translator', 'admin'].forEach(role =>
      it(`should correctly show component for ${role}`,
        () => checkShowTerm(selectedTerm, role, lang.id)
      )
    )
  );
});
