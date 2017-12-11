const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  defaultTranslator,
  mountWithIntl,
  initialState,
  getAppPath,
  languages,
  shallow
} = require('../../_shared.js');

const TestedComponent = require(
  getAppPath(2) + 'components/translator/EditPasswordByTranslator'
).default.WrappedComponent;

describe('Testing EditPasswordByTranslator Component.', () => {

  const props = {
    stateData: {...initialState.translator.editPassword,
      currentPassword: 'current password',
      confirmPassword: 'new password',
      newPassword: 'new password'
    },
    params: {
      id: defaultTranslator.id
    }
  };

  const currPassInputId = '[data-test-id="input-current-pass"]';
  const confPassInputId = '[data-test-id="input-confirm-pass"]';
  const newPassInputId = '[data-test-id="input-new-pass"]';
  const btnResetId = '[data-test-id="btn-reset"]';
  const btnSaveId = '[data-test-id="btn-save"]';

  it('should correctly handle actions on the component', () => {
    const spyCurrPass = sinon.spy(TestedComponent.prototype, 'changeCurrentPassword');
    const spyConfPass = sinon.spy(TestedComponent.prototype, 'changeConfirmPassword');
    const spyNewPass = sinon.spy(TestedComponent.prototype, 'changeNewPassword');
    const spyBtnSave = sinon.spy(TestedComponent.prototype, 'sendNewPassword');
    const spyBtnReset = sinon.spy(TestedComponent.prototype, 'resetChanges');

    const defaultEvent = {
      preventDefault: () => true,
      target: {
        value: 'password'
      }
    };
    const wrapper = shallow(<TestedComponent {...props} />);

    wrapper.find(currPassInputId).simulate('change', defaultEvent);
    wrapper.find(confPassInputId).simulate('change', defaultEvent);
    wrapper.find(newPassInputId).simulate('change', defaultEvent);
    wrapper.find(btnResetId).simulate('click', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    expect(spyCurrPass.calledOnce).to.equal(true);
    expect(spyConfPass.calledOnce).to.equal(true);
    expect(spyNewPass.calledOnce).to.equal(true);
    expect(spyBtnSave.calledOnce).to.equal(true);
    expect(spyBtnReset.calledOnce).to.equal(true);

    wrapper.unmount();
  });

  const btnCancelId = '[data-test-id="btn-cancel"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<TestedComponent {...props} />);

    const mainContentId = '[data-test-id="EditPasswordByTranslator"]';
    expect(wrapper.find(mainContentId).exists()).equal(true);

    const editedCurrentPassword = props.stateData.currentPassword + ' new';
    wrapper.setProps({...props,
      stateData: {...props.stateData,
        currentPassword: editedCurrentPassword
      }
    });
    expect(wrapper.find(currPassInputId).props().value).equal(editedCurrentPassword);

    const editedNewPassword = props.stateData.newPassword + ' new';
    wrapper.setProps({...props,
      stateData: {...props.stateData,
        newPassword: editedNewPassword
      }
    });
    expect(wrapper.find(newPassInputId).props().value).equal(editedNewPassword);

    const editedConfirmPassword = props.stateData.confirmPassword + ' new';
    wrapper.setProps({...props,
      stateData: {...props.stateData,
        confirmPassword: editedConfirmPassword
      }
    });
    expect(wrapper.find(confPassInputId).props().value).equal(editedConfirmPassword);

    wrapper.setProps(props);
    expect(!!wrapper.find(btnSaveId).props().disabled).equal(false);

    const expectedLink = '/translator/' + defaultTranslator.id;
    expect(wrapper.find(btnCancelId).props().to).equal(expectedLink);

    wrapper.unmount();
  });

  it('should disable save button on the component', () => {
    const wrapper = shallow(<TestedComponent {...props} />);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        currentPassword: ''
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        newPassword: ''
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        confirmPassword: ''
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        confirmPassword: 'Invalid password',
        newPassword: 'Valid password'
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        newPassword: 'short'  // less than 6 characters
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.unmount();
  });

  const arrIntlStringsId = [
    ['[data-test-id="label-confirm-pass"]', 'EditPasswordByTranslator.new_password_confirm'],
    ['[data-test-id="label-current-pass"]', 'EditPasswordByTranslator.current_password'],
    ['[data-test-id="hint-new-pass"]', 'EditPasswordByTranslator.new_password_hint'],
    ['[data-test-id="label-new-pass"]', 'EditPasswordByTranslator.new_password'],
    ['[data-test-id="title"]', 'EditPasswordByTranslator.title'],
    [btnCancelId, 'Common.cancel'],
    [btnResetId, 'Common.reset'],
    [btnSaveId, 'Common.save']
  ];

  languages.forEach(lang => {
    const i18n = require(getAppPath(2) + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component (${lang.id})`, () =>
      arrIntlStringsId.forEach(couple =>
        expect(i18n.hasOwnProperty(couple[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(
        <TestedComponent {...props} />, lang.id
      );

      let couple = arrIntlStringsId[0];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[1];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[2];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[3];
      expect(wrapper.find(couple[0]).text()).equal(
        i18n[couple[1]] + i18n[arrIntlStringsId[2][1]]
      );

      couple = arrIntlStringsId[4];
      expect(wrapper.find(couple[0]).text()).equal(
        i18n[couple[1]].replace('{id}', defaultTranslator.id)
      );

      couple = arrIntlStringsId[5];
      expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[6];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[7];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      wrapper.unmount();
    });
  });
});
