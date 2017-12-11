const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  defaultTranslator,
  mountWithIntl,
  defaultTerm,
  defaultUser,
  translators,
  getAppPath,
  languages,
  shallow
} = require('../../_shared.js');

const Term = require(getAppPath(2) + 'components/search/Term').default.WrappedComponent;

describe('Testing Term Component.', () => {

  const translatorsOfTerm = defaultTerm.translations.map(e => e.translatorId);
  const translationsLength = defaultTerm.translations.length;
  const props = {
    data: {
      term: defaultTerm
    },
    lang: defaultUser.language,
    userInfo: defaultUser,
    translators
  };

  const openCommentId = '[data-test-id="comment-link"]';

  it('should work correctly, method \'toggleComment\'', () => {
    const spyOnToggleComment = sinon.spy(Term.prototype, 'onToggleComment');
    const wrapper = shallow(<Term {...props} />);

    const openCommentId = '[data-test-id="comment-link"]';
    let toggleCommentCalls = 0;
    let commentsCount = 0;

    defaultTerm.translations.forEach(t => t.meanings.forEach(e => commentsCount += !!e.comment));

    for (let i = 0; i < commentsCount; i++) {
      wrapper.find(openCommentId).at(i).simulate('click');
      toggleCommentCalls++;
    }

    expect(spyOnToggleComment.callCount).equal(toggleCommentCalls);

    wrapper.unmount();
  });

  const linkEditMeaningId = '[data-test-id="link-to-edit"]';

  it('should work correctly, local method \'canEdit\'', () => {
    const wrapper = shallow(<Term {...props} />);

    wrapper.setState({
      userInfo: null
    });
    expect(wrapper.find(linkEditMeaningId).exists()).equal(false);

    wrapper.setState({
      userInfo: {...props.userInfo,
        role: 'admin'
      }
    });
    expect(wrapper.find(linkEditMeaningId).length).equal(translationsLength);

    translatorsOfTerm.forEach(translator => {
      wrapper.setState({
        userInfo: {...props.userInfo,
          role: 'translator',
          id: translator
        }
      });
      expect(wrapper.find(linkEditMeaningId).length).equal(1);
      const {termId, translatorId} = wrapper.find(linkEditMeaningId).first().props().to.query;
      expect(termId).equal(defaultTerm.wylie);
      expect(translatorId).equal(translator);

      // wrapper.setState({
      //   userInfo: {...props.userInfo,
      //     role: 'user',  // maybe it's vulnerability?
      //     id: translator
      //   }
      // });
      // expect(wrapper.find(linkEditId).exists()).equal(false);
    });

    wrapper.unmount();
  });

  const linkAddTranslationId = '[data-test-id="link-add-translation"]';

  it('should work correctly, local method \'canAdd\'', () => {
    const wrapper = shallow(<Term {...props} />);

    wrapper.setState({
      userInfo: null
    });
    expect(wrapper.find(linkAddTranslationId).exists()).equal(false);

    wrapper.setState({
      userInfo: {...props.userInfo,
        role: 'user'
      }
    });
    expect(wrapper.find(linkAddTranslationId).exists()).equal(false);

    wrapper.setState({
      userInfo: {...props.userInfo,
        role: 'admin'
      }
    });
    expect(wrapper.find(linkAddTranslationId).exists()).equal(false);

    wrapper.setState({
      userInfo: {...defaultTranslator,
        id: defaultTerm.translations[0].translatorId
      }
    });
    expect(wrapper.find(linkAddTranslationId).exists()).equal(false);

    wrapper.setState({
      userInfo: {...defaultTranslator,
        id: 'id of translator who not write yet'
      }
    });
    expect(wrapper.find(linkAddTranslationId).exists()).equal(true);

    wrapper.unmount();
  });

  const mainId = '[data-test-id="Term"]';
  const linkTranslatorId = '[data-test-id="link-translator"]';
  const openedCommentId = '[data-test-id="opened-comment"]';
  const listMeaningsId = '[data-test-id="list-meanings"]';
  const translationId = '[data-test-id="translation"]';
  const wylieId = '[data-test-id="wylie-header"]';
  const meaningId = '[data-test-id="meaning"]';
  const versionId = '[data-test-id="version"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<Term {...props} />);

    expect(wrapper.find(mainId).exists()).equal(true);
    expect(wrapper.find(wylieId).text()).equal(defaultTerm.wylie);

    defaultTerm.translations.forEach((translation, i) => {
      expect(wrapper.find(translationId).at(i).exists()).equal(true);

      expect(wrapper.find(linkTranslatorId).at(i).props().to).equal(
        'translator/' + translation.translatorId
      );
      expect(wrapper.find(linkTranslatorId).at(i).props().children).equal(
        translators.find(t => t.id === translation.translatorId).name
      );

      expect(wrapper.find(listMeaningsId).at(i).props().className).equal(
        'meanings' + (translation.meanings.length === 1 ? ' single-item' : '')
      );

      translation.meanings.forEach((meaning, meaningIndex) => {
        expect(wrapper.find(meaningId).at(meaningIndex).exists()).equal(true);

        // meaning.versions.forEach((version, versionIndex) => {
        //   expect(wrapper.find(meaningId).find(versionId).at(versionIndex).props().children).equal(
        //     version + (versionIndex < meaning.versions.length - 1 ? '; ' : '')
        //   );
        // });

        let _wrap = wrapper.find(translationId).at(i).find(meaningId).at(meaningIndex).find(openCommentId);
        if (meaning.comment !== '') {
          expect(_wrap.exists()).equal(true);
          expect(_wrap.props().children).equal('>>>');

          expect(_wrap.find(openedCommentId).exists()).equal(false);
          defaultTerm.translations[i].meanings[meaningIndex].openComment = true;
          wrapper.setProps({...props,
            data: {...props.data,
              term: defaultTerm
            }
          });
          _wrap = wrapper.find(translationId).at(i).find(meaningId).at(meaningIndex).find(openedCommentId);
          expect(_wrap.props().children).equal(defaultTerm.translations[i].meanings[meaningIndex].comment);
        } else {
          expect(_wrap.find(openCommentId).exists()).equal(false);
        }
      });
    });

    wrapper.unmount();
  });

  const arrIntlStringsId = [
    ['[data-test-id="link-add-translation"]', 'Term.add_translation'],
    ['[data-test-id="sanskrit"]', 'Term.sanskrit_term']
  ];

  languages.forEach(lang => {
    const i18n = require(getAppPath(2) + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component (${lang.id})`, () =>
      arrIntlStringsId.forEach(couple =>
        expect(i18n.hasOwnProperty(couple[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<Term {...props} />, lang.id);

      let couple = arrIntlStringsId[0];
      wrapper.setState({
        userInfo: {...props.userInfo,
          role: 'translator',
          id: 'nonexistent'
        }
      });
      expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[1];
      expect(wrapper.find(couple[0]).text()).equal(
        i18n[couple[1]].replace(
          `{sanskrit_${lang.id}}`,
          defaultTerm['sanskrit_' + lang.id]
        )
      );

      wrapper.unmount();
    });
  });
});
