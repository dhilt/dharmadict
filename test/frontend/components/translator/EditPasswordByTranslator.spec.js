const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  defaultTranslator,
  initialState,
  getAppPath,
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

    expect(spyCurrPass.calledOnce).equal(true);
    expect(spyConfPass.calledOnce).equal(true);
    expect(spyNewPass.calledOnce).equal(true);
    expect(spyBtnSave.calledOnce).equal(true);
    expect(spyBtnReset.calledOnce).equal(true);

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
    expect(wrapper.find(currPassInputId).prop('value')).equal(editedCurrentPassword);

    const editedNewPassword = props.stateData.newPassword + ' new';
    wrapper.setProps({...props,
      stateData: {...props.stateData,
        newPassword: editedNewPassword
      }
    });
    expect(wrapper.find(newPassInputId).prop('value')).equal(editedNewPassword);

    const editedConfirmPassword = props.stateData.confirmPassword + ' new';
    wrapper.setProps({...props,
      stateData: {...props.stateData,
        confirmPassword: editedConfirmPassword
      }
    });
    expect(wrapper.find(confPassInputId).prop('value')).equal(editedConfirmPassword);

    wrapper.setProps(props);
    expect(!!wrapper.find(btnSaveId).prop('disabled')).equal(false);

    const expectedLink = '/translator/' + defaultTranslator.id;
    expect(wrapper.find(btnCancelId).prop('to')).equal(expectedLink);

    wrapper.unmount();
  });

  it('should disable save button on the component', () => {
    const wrapper = shallow(<TestedComponent {...props} />);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        currentPassword: ''
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        newPassword: ''
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        confirmPassword: ''
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        confirmPassword: 'Invalid password',
        newPassword: 'Valid password'
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        newPassword: 'short'  // less than 6 characters
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.unmount();
  });
});
