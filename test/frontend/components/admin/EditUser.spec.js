const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  getEditableUserDataObject,
  defaultTranslator,
  mountWithIntl,
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

  const inputDescId = '[data-test-id="textarea-desc"]';
  const inputLangId = '[data-test-id="input-lang"]';
  const inputNameId = '[data-test-id="input-name"]';
  const radioLangId = '[data-test-id="radio-lang"]';
  const btnResetId = '[data-test-id="button-reset"]';
  const btnSaveId = '[data-test-id="button-save"]';

  it('should correctly handle actions on the component', () => {
    const spyWillMount = sinon.spy(EditUser.prototype, 'componentWillMount');
    const spyChangeDesc = sinon.spy(EditUser.prototype, 'changeUserDescription');
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
    wrapper.find(inputDescId).simulate('change', defaultEvent);
    wrapper.find(inputNameId).simulate('change', defaultEvent);
    wrapper.find(btnResetId).simulate('click', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    expect(spyChangeLang.callCount).to.equal(langLength);
    expect(spyChangeDesc.calledOnce).to.equal(true);
    expect(spyChangeName.calledOnce).to.equal(true);
    expect(spyWillMount.calledOnce).to.equal(true);
    expect(spyBtnReset.calledOnce).to.equal(true);
    expect(spyBtnSave.calledOnce).to.equal(true);

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
    expect(wrapper.find(inputNameId).props().value).equal(editedName);

    const editedDesc = defaultTranslator.description + ' new';
    wrapper.setProps({...props,
      editUser: {...props.editUser,
        data: {...props.editUser.data,
          description: editedDesc
        }
      }
    });
    expect(wrapper.find(inputDescId).props().value).equal(editedDesc);

    languages.forEach((lang, index) => {
      wrapper.setProps({...props,
        editUser: {...props.editUser,
          data: {...props.editUser.data,
            language: lang.id
          }
        }
      });
      languages.forEach((_lang, _index) =>
        expect(wrapper.find(inputLangId).at(_index).props().checked)
          .equal(lang.id === _lang.id)
      );
    });

    wrapper.setProps({...props,
      editUser: {...props.editUser,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    const expectedLinkCancel = '/translator/' + defaultTranslator.id;
    expect(wrapper.find(linkCancelId).props().to).equal(expectedLinkCancel);

    const expectedLinkPassword = expectedLinkCancel + '/edit/password';
    expect(wrapper.find(linkPasswordId).props().to).equal(expectedLinkPassword);

    wrapper.unmount();
  });

  const arrIntlStringsId = [
    ['[data-test-id="desc-help"]', 'EditUser.description_of_translator_help'],
    ['[data-test-id="label-desc"]', 'EditUser.description_of_translator'],
    ['[data-test-id="label-lang"]', 'EditUser.language_of_translations'],
    ['[data-test-id="label-name"]', 'EditUser.name_of_translator'],
    ['[data-test-id="heading"]', 'EditUser.title_edit_user'],
    [linkPasswordId, 'EditUser.link_reset_password'],
    [linkCancelId, 'Common.cancel'],
    [btnResetId, 'Common.reset'],
    [btnSaveId, 'Common.save']
  ];

  languages.forEach(lang => {
    const i18n = require(getAppPath(2) + 'i18n/' + lang.id);

    it(`should show correctly languages on the component`, () => {
      const wrapper = mountWithIntl(<EditUser {...props} />, lang.id);
      wrapper.setProps({...props,
        common: {...props.common,
          userLanguage: lang.id
        }
      });

      languages.forEach((_lang, _langIndex) => {
        const expectedStr = _lang['name_' + lang.id];
        const foundStr = wrapper.find(radioLangId).at(_langIndex).text();
        expect(foundStr).equal(expectedStr);
      });

      wrapper.unmount();
    });

    it(`should exists all i18n-texts for the component (${lang.id})`, () =>
      arrIntlStringsId.forEach(couple =>
        expect(i18n.hasOwnProperty(couple[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<EditUser {...props} />, lang.id);

      let couple = arrIntlStringsId[0];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[1];
      expect(wrapper.find(couple[0]).text()).equal(
        i18n[arrIntlStringsId[1][1]] + i18n[arrIntlStringsId[0][1]]
      );

      couple = arrIntlStringsId[2];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[3];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[4];
      expect(wrapper.find(couple[0]).text()).equal(
        i18n[couple[1]].replace('{id}', defaultTranslator.id)
      );

      couple = arrIntlStringsId[5];
      expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[6];
      expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[7];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[8];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      wrapper.unmount();
    });
  });
});
