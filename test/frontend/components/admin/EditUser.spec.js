const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  getEditableUserDataObject,
  defaultTranslator,
  initialState,
  defaultLang,
  getAppPath,
  languages,
  shallow
} = require('../../_shared.js');

const EditUser = require(getAppPath(2) + 'components/admin/EditUser').default.WrappedComponent;

describe('Testing EditUser Component.', () => {

  const props = {
    editUser: {...initialState.admin.editUser,
      dataSource: getEditableUserDataObject(defaultTranslator),
      data: getEditableUserDataObject(defaultTranslator),
      id: defaultTranslator.id
    },
    common: {
      userLanguage: defaultLang,
      languages
    },
    params: {
      id: defaultTranslator.id
    }
  };

  const inputLangId = '[data-test-id="input-lang"]';
  const inputNameId = '[data-test-id="input-name"]';
  const radioLangId = '[data-test-id="radio-lang"]';
  const btnResetId = '[data-test-id="button-reset"]';
  const btnSaveId = '[data-test-id="button-save"]';

  it('should correctly handle actions on the component', () => {
    const spyWillMount = sinon.spy(EditUser.prototype, 'componentWillMount');
    const spyChangeLang = sinon.spy(EditUser.prototype, 'changeUserLanguage');
    const spyChangeName = sinon.spy(EditUser.prototype, 'changeUserName');
    const spyBtnSave = sinon.spy(EditUser.prototype, 'sendNewUserData');
    const spyBtnReset = sinon.spy(EditUser.prototype, 'resetChanges');

    const defaultEvent = {
      preventDefault: () => true,
      target: {
        value: 'some words'
      }
    };
    const wrapper = shallow(<EditUser {...props} />);

    const langLength = languages.length;
    for (let i = 0; i < langLength; i++) {
      wrapper.find(inputLangId).at(i).simulate('change');
    }
    wrapper.find(inputNameId).simulate('change', defaultEvent);
    wrapper.find(btnResetId).simulate('click', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    expect(spyChangeLang.callCount).equal(langLength);
    expect(spyChangeName.calledOnce).equal(true);
    expect(spyWillMount.calledOnce).equal(true);
    expect(spyBtnReset.calledOnce).equal(true);
    expect(spyBtnSave.calledOnce).equal(true);

    wrapper.unmount();
  });

  const linkPasswordId = '[data-test-id="link-password"]';
  const linkCancelId = '[data-test-id="button-cancel"]';
  const mainId = '[data-test-id="EditUser"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<EditUser {...props} />);

    expect(wrapper.find(mainId).exists()).equal(true);

    wrapper.setProps({...props,
      editUser: {...props.editUser,
        sourcePending: true
      }
    });
    expect(wrapper.find(mainId).exists()).equal(false);

    const editedName = defaultTranslator.name + ' new';
    wrapper.setProps({...props,
      editUser: {...props.editUser,
        data: {...props.editUser.data,
          name: editedName
        }
      }
    });
    expect(wrapper.find(inputNameId).prop('value')).equal(editedName);

    languages.forEach((lang, index) => {
      wrapper.setProps({...props,
        editUser: {...props.editUser,
          data: {...props.editUser.data,
            language: lang.id
          }
        }
      });
      languages.forEach((_lang, _index) =>
        expect(wrapper.find(inputLangId).at(_index).prop('checked'))
          .equal(lang.id === _lang.id)
      );
    });

    wrapper.setProps({...props,
      editUser: {...props.editUser,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    const expectedLinkCancel = '/translator/' + defaultTranslator.id;
    expect(wrapper.find(linkCancelId).prop('to')).equal(expectedLinkCancel);

    const expectedLinkPassword = expectedLinkCancel + '/edit/password';
    expect(wrapper.find(linkPasswordId).prop('to')).equal(expectedLinkPassword);

    wrapper.unmount();
  });
});
