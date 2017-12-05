const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  mountWithIntl,
  initialState,
  defaultTerm,
  defaultLang,
  languages,
  _appPath,
  shallow
} = require('../../_shared.js');

const Meanings = require(_appPath + 'components/edit/Meanings').default.WrappedComponent;

describe('Testing Meanings Component.', () => {

  const defaultTranslation = defaultTerm.translations[0];
  const props = {
    data: {...initialState.edit,
      termName: 'Term name',
      change: defaultTranslation
    },
    userLang: defaultLang
  };

  const textareaCommentChangeId = '[data-test-id="comment-textarea"]';
  const inputVersionChangeId = '[data-test-id="input-version"]';
  const btnVersionRemoveId = '[data-test-id="button-version"]';
  const linkAddMeaningId = '[data-test-id="add-new-meaning"]';
  const linkMeaningRemoveId = '[data-test-id="remove-link"]';

  it('should correctly handle actions on the component', () => {
    const spyOnCommentChanged = sinon.spy(Meanings.prototype, 'onCommentChanged');
    const spyOnMeaningRemoved = sinon.spy(Meanings.prototype, 'onMeaningRemoved');
    const spyOnVerChanged = sinon.spy(Meanings.prototype, 'onVersionChanged');
    const spyOnVerRemoved = sinon.spy(Meanings.prototype, 'onVersionRemoved');
    const spyOnMeaningAdd = sinon.spy(Meanings.prototype, 'addNewMeaning');

    const defaultEvent = {
      preventDefault: () => true,
      target: {
        value: 'some words'
      }
    };
    const wrapper = shallow(<Meanings {...props} />);

    let removeMeaningCalls = 0;
    let changeCommentCalls = 0;
    let removeVersionCalls = 0;
    let changeVersionCalls = 0;

    wrapper.find(linkAddMeaningId).simulate('click', defaultEvent);
    defaultTranslation.meanings.forEach((meaning, index) => {
      wrapper.find(textareaCommentChangeId).at(index).simulate('change', defaultEvent);
      wrapper.find(linkMeaningRemoveId).at(index).simulate('click', defaultEvent);
      removeMeaningCalls++;
      changeCommentCalls++;
      meaning.versions.forEach((version, _index) => {
        wrapper.find(inputVersionChangeId).at(_index).simulate('change', defaultEvent);
        wrapper.find(btnVersionRemoveId).at(_index).simulate('click', defaultEvent);
        removeVersionCalls++;
        changeVersionCalls++;
      });
    });

    expect(spyOnMeaningRemoved.callCount).to.equal(removeMeaningCalls);
    expect(spyOnCommentChanged.callCount).to.equal(changeCommentCalls);
    expect(spyOnVerChanged.callCount).to.equal(changeVersionCalls);
    expect(spyOnVerRemoved.callCount).to.equal(removeVersionCalls);
    expect(spyOnMeaningAdd.calledOnce).to.equal(true);

    wrapper.unmount();
  });

  it('should show component correctly', () => {
    const wrapper = shallow(<Meanings {...props} />);

    const mainId = '[data-test-id="Meanings"]';
    expect(wrapper.find(mainId).exists()).equal(true);

    const termNameId = '[data-test-id="termName"]';
    expect(wrapper.find(termNameId).text()).equal(props.data.termName);

    const editedTermName = props.data.termName + ' new';
    wrapper.setProps({...props,
      data: {...props.data,
        termName: editedTermName
      }
    });
    expect(wrapper.find(termNameId).text()).equal(editedTermName);

    const inputVersionId = '[data-test-id="input-version"]';
    const btnVersionId = '[data-test-id="button-version"]';
    const versionId = '[data-test-id="li-version"]';
    const meaningId = '[data-test-id="meaning"]';
    const commentId = '[data-test-id="comment"]';
    const removeId = '[data-test-id="remove"]';

    defaultTranslation.meanings.forEach((meaning, meaningIndex) => {
      expect(wrapper.find(meaningId).at(meaningIndex).exists()).equal(true);
      expect(wrapper.find(commentId).at(meaningIndex).exists()).equal(true);
      expect(wrapper.find(removeId).at(meaningIndex).exists()).equal(true);

      meaning.versions.forEach((version, versionIndex) => {
        let _wrap = wrapper.find(meaningId).at(meaningIndex).find(versionId);
        expect(_wrap.exists()).equal(true);

        const initVersionValue = props.data.change.meanings[meaningIndex].versions[versionIndex];
        _wrap = wrapper.find(meaningId).at(meaningIndex).find(inputVersionId).at(versionIndex);
        expect(_wrap.props().value).equal(initVersionValue);

        const newVersionValue = props.data.change.meanings[meaningIndex].versions[versionIndex] + ' new ' + versionIndex;
        let _props = JSON.parse(JSON.stringify(props));
        _props.data.change.meanings[meaningIndex].versions[versionIndex] = newVersionValue;
        wrapper.setProps(_props);
        _wrap = wrapper.find(meaningId).at(meaningIndex).find(inputVersionId).at(versionIndex);
        expect(_wrap.props().value).equal(newVersionValue);
      });

      const lastVersionOfMeaning = wrapper.find(meaningId).find(btnVersionId).at(meaning.versions.length - 1);
      expect(lastVersionOfMeaning.props().disabled).equal('disabled');

      const commentTextId = '[data-test-id="comment-textarea"]';
      let _wrap = wrapper.find(commentTextId).at(meaningIndex);
      let expectedStr = props.data.change.meanings[meaningIndex].comment;
      expect(_wrap.props().value).equal(expectedStr);

      let _props = JSON.parse(JSON.stringify(props));
      expectedStr = 'new comment on meaning ' + meaningIndex;
      _props.data.change.meanings[meaningIndex].comment = expectedStr;
      wrapper.setProps(_props);
      _wrap = wrapper.find(commentTextId).at(meaningIndex);
      expect(_wrap.props().value).equal(expectedStr);
    });

    const divNoMeaningsId = '[data-test-id="div-no-meanings"]';
    wrapper.setProps({...props,
      data: {...props.data,
        change: {...props.data.change,
          meanings: []
        }
      }
    });
    expect(wrapper.find(divNoMeaningsId).exists()).equal(true);

    wrapper.setProps(props);
    expect(wrapper.find(divNoMeaningsId).exists()).equal(false);

    wrapper.unmount();
  });

  const arrIntlStringsId = [
    ['[data-test-id="div-no-meanings"]', 'Meanings.have_no_one_meaning'],
    ['[data-test-id="comment-title"]', 'Meanings.comment_for_meaning'],
    ['[data-test-id="meaning-title"]', 'Meanings.number_of_meaning'],
    [linkMeaningRemoveId, 'Meanings.button_delete_meaning'],
    [linkAddMeaningId, 'Meanings.add_new_meaning']
  ];

  languages.forEach(lang => {
    const i18n = require(_appPath + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component (${lang.id})`, () =>
      arrIntlStringsId.forEach(couple =>
        expect(i18n.hasOwnProperty(couple[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<Meanings {...props} />, lang.id);

      wrapper.setProps({...props,
        data: {...props.data,
          change: {...props.data.change,
            meanings: []
          }
        }
      });
      let couple = arrIntlStringsId[0];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      wrapper.setProps(props);
      props.data.change.meanings.forEach((m, i) => {
        couple = arrIntlStringsId[1];
        expect(wrapper.find(couple[0]).at(i).text()).equal(
          i18n[couple[1]].replace('{indexOfMeaning}', i + 1)
        );

        couple = arrIntlStringsId[2];
        expect(wrapper.find(couple[0]).at(i).text()).equal(
          i18n[couple[1]].replace('{indexOfMeaning}', i + 1)
        );

        couple = arrIntlStringsId[3];
        expect(wrapper.find(couple[0]).at(i).text()).equal(
          i18n[couple[1]].replace('{indexOfMeaning}', i + 1)
        );
      });

      couple = arrIntlStringsId[4];
      expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);

      wrapper.unmount();
    });
  });
});
