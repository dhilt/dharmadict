global.window.localStorage = {};

const Term = require('../../../../app/components/search/Term').default;
const {
  setupComponent,
  checkWrap,
  initialState,
  terms,
  translators,
  users,
  languages
} = require('../../_shared.js');

describe('Testing Term Component.', () => {

  const checkShowTerm = (selectedTerm, user, lang) => {
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
            role: user.role,
            id: user.id
          }
        }
      }
    };
    const wrapper = setupComponent(Term, _initialState);
    const i18n = require('../../../../app/i18n/' + lang);

    checkWrap(wrapper.find('[data-test-id="Term"]'), {
      className: 'term'
    });

    checkWrap(wrapper.find('[data-test-id="term-header"]'), {
      className: 'term-header'
    });

    checkWrap(wrapper.find('[data-test-id="wylie-header"]'), {
      className: 'wylie',
      text: selectedTerm.wylie
    });

    checkWrap(wrapper.find('[data-test-id="sanskrit"]'), {
      className: 'sanskrit',
      text: i18n['Term.sanskrit_term'].replace(`{sanskrit_${lang}}`, '')
            + selectedTerm[`sanskrit_${lang}`]
    });

    checkWrap(wrapper.find('[data-test-id="translation-list"]'), {
      className: 'translation-list'
    });

    checkWrap(wrapper.find('[data-test-id="translation"]'), {
      length: selectedTerm.translations.length
    });

    let _versionIndex = -1;
    selectedTerm.translations.forEach((translation, translationIndex) => {

      checkWrap(wrapper.find('[data-test-id="translation"]').at(translationIndex), {
        className: 'translation'
      });

      checkWrap(wrapper.find('[data-test-id="wrap-translator-ref"]').at(translationIndex), {
        className: 'wrap-translator-ref'
      });

      checkWrap(wrapper.find('a[data-test-id="link-translator"]').at(translationIndex), {
        className: 'translator=ref',
        // reference ?
        text: translators.find(e => e.id === translation.translatorId).name
      });

      if (user.role === 'admin') {
        checkWrap(wrapper.find('a[data-test-id="link-to-edit"]'), {
          length: selectedTerm.translations.length
        });
        checkWrap(wrapper.find('[data-test-id="edit-icon"].edit-icon'), {
          length: selectedTerm.translations.length
        });
      } else if (translation.translatorId === user.id) {
        checkWrap(wrapper.find('a[data-test-id="link-to-edit"]'));
        checkWrap(wrapper.find('[data-test-id="edit-icon"].edit-icon'));
      } else if (!selectedTerm.translations.find(t => t.translatorId === user.id)) {
        checkWrap(wrapper.find('[data-test-id="link-to-edit"]'), {
          length: 0
        });
        checkWrap(wrapper.find('[data-test-id="edit-icon"].edit-icon'), {
          length: 0
        });
      }

      checkWrap(wrapper.find('[data-test-id="list-meanings"]').at(translationIndex), {
        length: 1,
        className: 'meanings' + (translation.meanings.length === 1 ? ' single-item' : '')
      });

      let meaningsLength = 0;
      selectedTerm.translations.forEach(e => meaningsLength += e.meanings.length);
      checkWrap(wrapper.find('[data-test-id="meaning"]'), {
        length: meaningsLength
      });

      translation.meanings.forEach((meaning, meaningIndex) => {

        checkWrap(wrapper.find('[data-test-id="meaning"]').at(meaningIndex));

        checkWrap(wrapper.find('[data-test-id="meaning"]').at(meaningIndex), {
          className: 'meaning'
        });

        let versionLength = 0;
        selectedTerm.translations.forEach(elem =>
          elem.meanings.forEach(e =>
            versionLength += e.versions.length
          )
        );
        checkWrap(wrapper.find('[data-test-id="version"]'), {
          length: versionLength
        });

        let amountComments = 0;
        meaning.versions.forEach(e => e.comment ? amountComments++ : null);
        if (amountComments) {
          checkWrap(wrapper.find('[data-test-id="commentLink"]'), {
            length: amountComments,
            className: 'commentLink',
            text: '>>>'
          })
        }

        let amountOpenComments = 0;
        meaning.versions.forEach(e => e.openComment ? amountComments++ : null);
        if (amountOpenComments) {
          checkWrap(wrapper.find('[data-test-id="translation-comment"]'), {
            length: amountOpenComments,
            className: 'translation-comment',
            text: ':'
          })
        }

        meaning.versions.forEach((version, versionIndex) => {
          _versionIndex++;
          checkWrap(wrapper.find('[data-test-id="version"]').at(_versionIndex), {
            text: version + (versionIndex < meaning.versions.length - 1 ? '; ' : '')
          });
        });
      });
    });

    if (!selectedTerm.translations.find(t => t.translatorId === user.id)
      && user.role === 'translator') {
      checkWrap(wrapper.find('[data-test-id="add-translation"].add-translation'));
      checkWrap(wrapper.find('a[data-test-id="link-add-translation"]'));
      checkWrap(wrapper.find('a[data-test-id="link-add-translation"]'), {
        text: i18n['Term.add-translation']
      });
    } else {
      checkWrap(wrapper.find('[data-test-id="add-translation"]'), { length: 0 });
      checkWrap(wrapper.find('[data-test-id="link-add-translation"]'), { length: 0 });
    }

    wrapper.unmount();
  };

  // tests starts here
  terms.forEach(term => {

    users.forEach(user =>
      it(`should correctly show component for ${user.id} with role ${user.role}`,
        () => checkShowTerm(term, user, user.language)
      )
    );

    translators.forEach(translator =>
      it(`should correctly show component for ${translator.id} with role ${translator.role}`,
        () => checkShowTerm(term, translator, translator.language)
      )
    );
  });
});
