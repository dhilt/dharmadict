const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  initialState,
  defaultTerm,
  getAppPath,
  shallow
} = require('../../_shared.js');

const Meanings = require(getAppPath(2) + 'components/edit/Meanings').default.WrappedComponent;

describe('Testing Meanings Component.', () => {

  const defaultTranslation = defaultTerm.translations[0];
  const props = {
    data: {...initialState.edit,
      termName: 'Term name',
      change: defaultTranslation
    }
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

    expect(spyOnMeaningRemoved.callCount).equal(removeMeaningCalls);
    expect(spyOnCommentChanged.callCount).equal(changeCommentCalls);
    expect(spyOnVerChanged.callCount).equal(changeVersionCalls);
    expect(spyOnVerRemoved.callCount).equal(removeVersionCalls);
    expect(spyOnMeaningAdd.calledOnce).equal(true);

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

    defaultTranslation.meanings.forEach((meaning, meaningIndex) => {
      expect(wrapper.find(meaningId).at(meaningIndex).exists()).equal(true);

      meaning.versions.forEach((version, versionIndex) => {
        let _wrap = wrapper.find(meaningId).at(meaningIndex).find(versionId);
        expect(_wrap.exists()).equal(true);

        const initVersionValue = props.data.change.meanings[meaningIndex].versions[versionIndex];
        _wrap = wrapper.find(meaningId).at(meaningIndex).find(inputVersionId).at(versionIndex);
        expect(_wrap.prop('value')).equal(initVersionValue);

        const newVersionValue = props.data.change.meanings[meaningIndex].versions[versionIndex] + ' new ' + versionIndex;
        let _props = JSON.parse(JSON.stringify(props));
        _props.data.change.meanings[meaningIndex].versions[versionIndex] = newVersionValue;
        wrapper.setProps(_props);
        _wrap = wrapper.find(meaningId).at(meaningIndex).find(inputVersionId).at(versionIndex);
        expect(_wrap.prop('value')).equal(newVersionValue);
      });

      const lastVersionOfMeaning = wrapper.find(meaningId).find(btnVersionId).at(meaning.versions.length - 1);
      expect(lastVersionOfMeaning.prop('disabled')).equal('disabled');

      const commentTextId = '[data-test-id="comment-textarea"]';
      let _wrap = wrapper.find(commentTextId).at(meaningIndex);
      let expectedStr = props.data.change.meanings[meaningIndex].comment;
      expect(_wrap.prop('value')).equal(expectedStr);

      let _props = JSON.parse(JSON.stringify(props));
      expectedStr = 'new comment on meaning ' + meaningIndex;
      _props.data.change.meanings[meaningIndex].comment = expectedStr;
      wrapper.setProps(_props);
      _wrap = wrapper.find(commentTextId).at(meaningIndex);
      expect(_wrap.prop('value')).equal(expectedStr);
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
});
