const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  defaultLang,
  languages,
  terms,
  _appPath
} = require('../../_shared.js');

const Meanings = require(_appPath + 'components/edit/Meanings').default;

describe('Testing Meanings Component.', () => {

  const checkShowMeanings = (termName, translation, lang) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: lang,
      },
      edit: { ...initialState.edit,
        termName,
        change: translation
      }
    };
    const {wrapper} = setupComponent(Meanings, _initialState);
    const i18n = require(_appPath + 'i18n/' + lang);

    checkWrap(wrapper.find('[data-test-id="Meanings"]'));

    checkWrap(wrapper.find('[data-test-id="termName"]'), {
      text: termName
    });

    checkWrap(wrapper.find('[data-test-id="meaningList"]'), {
      className: 'meaningList'
    });

    let _versionIndex = -1;
    translation.meanings.forEach((meaning, meaningIndex) => {

      checkWrap(wrapper.find('[data-test-id="li-meaning"]').at(meaningIndex));

      checkWrap(wrapper.find('[data-test-id="meaning"]').at(meaningIndex), {
        className: 'meaning'
      });

      checkWrap(wrapper.find('[data-test-id="meaning-title"]').at(meaningIndex), {
        text: i18n['Meanings.number_of_meaning'].replace(`{indexOfMeaning}`, meaningIndex + 1),
        className: 'title'
      });

      checkWrap(wrapper.find('[data-test-id="versionList"]').at(meaningIndex), {
        className: 'versionList'
      });

      meaning.versions.forEach((version, versionIndex) => {
        _versionIndex++;

        checkWrap(wrapper.find('[data-test-id="li-version"]').at(_versionIndex), {
          className: 'form-group form-inline'
        });

        checkWrap(wrapper.find('[data-test-id="input-version"]').at(_versionIndex), {
          className: 'form-control',
          name: 'search',
          type: 'text',
          value: version,
        });

        checkWrap(wrapper.find('[data-test-id="button-version"]').at(_versionIndex), {
          className: 'btn btn-link btn-sm remove-btn',
          type: 'button',
          text: 'X',
          disabled: versionIndex === meaning.versions.length - 1 ? "disabled" : ""
        });
      });

      checkWrap(wrapper.find('[data-test-id="comment"]').at(meaningIndex), {
        className: 'comment'
      });

      checkWrap(wrapper.find('[data-test-id="comment-title"]').at(meaningIndex), {
        text: i18n['Meanings.comment_for_meaning'].replace(`{indexOfMeaning}`, meaningIndex + 1),
        className: 'title'
      });

      checkWrap(wrapper.find('[data-test-id="comment-group"]').at(meaningIndex), {
        className: 'form-group form-inline'
      });

      checkWrap(wrapper.find('[data-test-id="comment-textarea"]').at(meaningIndex), {
        className: 'form-control',
        name: 'comment',
        value: meaning.comment || ''
      });

      checkWrap(wrapper.find('[data-test-id="remove"]').at(meaningIndex), {
        className: 'remove'
      });

      checkWrap(wrapper.find('[data-test-id="remove-link"]').at(meaningIndex), {
        text: i18n['Meanings.button_delete_meaning'].replace(`{indexOfMeaning}`, meaningIndex + 1),
        className: 'remove-link'
      });
    });

    checkWrap(wrapper.find('[data-test-id="li-no-meanings"]'));

    if (!translation.meanings.length) {
      checkWrap(wrapper.find('[data-test-id="div-no-meanings"]'), {
        text: i18n['Meanings.have_no_one_meaning'],
        className: 'no-meanings'
      })
    } else {
      checkWrap(wrapper.find('[data-test-id="div-no-meanings"]'), {
        length: 0
      })
    }

    checkWrap(wrapper.find('[data-test-id="add-new-meaning"]'), {
      text: i18n['Meanings.add_new_meaning'],
      className: 'add-new-meaning'
    })

    checkWrap(wrapper.find('[data-test-id="EditControls"]'), {
      className: 'form-group form-inline'
    });
    // further tests in "test/frontend/components/edit/EditControls"

    wrapper.unmount();
  };

  terms.forEach(term =>
    term.translations.forEach(translation =>
      languages.forEach(lang =>
        it(`should show component with translation of ${term.wylie} by ${translation.translatorId} correctly`,
          () => checkShowMeanings(term.wylie, translation, lang.id)
        )
      )
    )
  );

  it('should correctly handle actions on component with existing translations', () => {
    const translation = terms[0].translations[0];
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: defaultLang
      },
      edit: { ...initialState.edit,
        termName: 'termName',
        change: translation
      }
    };
    const {wrapper, store} = setupComponent(Meanings, _initialState);

    let actionsCount = 0;
    checkWrapActions(store, actionsCount);

    translation.meanings.forEach((meaning, index) => {
      wrapper.find('[data-test-id="input-version"]').at(index).props().onChange({target: {value: 'meaning'}});
      checkWrapActions(store, ++actionsCount);

      wrapper.find('[data-test-id="button-version"]').at(index).props().onClick({preventDefault: () => {}});
      checkWrapActions(store, ++actionsCount);

      wrapper.find('[data-test-id="comment-textarea"]').at(index).props().onChange({target: {value: 'comment'}});
      checkWrapActions(store, ++actionsCount);

      wrapper.find('[data-test-id="remove-link"]').at(index).props().onClick({preventDefault: () => {}});
      checkWrapActions(store, ++actionsCount);
    });
  });

  it('should correctly handle actions on component with no translations', () => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: defaultLang
      },
      edit: { ...initialState.edit,
        termName: 'termName',
        change: { meanings: [] }
      }
    };
    const _props = {
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(Meanings, _initialState, _props);
    let actionsCount = 0;
    checkWrapActions(store, actionsCount);

    wrapper.find('[data-test-id="add-new-meaning"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);
  });
});
