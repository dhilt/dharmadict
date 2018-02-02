const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  initialState,
  defaultUser,
  defaultLang,
  getAppPath,
  shallow
} = require('../../_shared.js');

const EditUserPassword = require(
  getAppPath(2) + 'components/admin/EditUserPassword'
).default.WrappedComponent;

describe('Testing EditUserPassword Component.', () => {

  const props = {
    stateData: {...initialState.admin.editUserPassword,
      confirmPassword: 'password',
      password: 'password',
      id: defaultUser.id
    },
    common: {
      userLanguage: defaultLang
    },
    params: {
      id: defaultUser.id
    }
  };

  const inputConfPassId = '[data-test-id="input-confirm-pass"]';
  const inputPassId = '[data-test-id="input-new-pass"]';
  const btnResetId = '[data-test-id="btn-reset"]';
  const btnSaveId = '[data-test-id="btn-save"]';

  it('should correctly handle actions on the component', () => {
    const spyWillMount = sinon.spy(EditUserPassword.prototype, 'componentWillMount');
    const spyChangeConfPass = sinon.spy(EditUserPassword.prototype, 'changeUserConfirmPassword');
    const spyChangePass = sinon.spy(EditUserPassword.prototype, 'changeUserPassword');
    const spyBtnSave = sinon.spy(EditUserPassword.prototype, 'sendNewUserData');
    const spyBtnReset = sinon.spy(EditUserPassword.prototype, 'resetChanges');

    const defaultEvent = {
      preventDefault: () => true,
      target: {
        value: 'password'
      }
    };
    const wrapper = shallow(<EditUserPassword {...props} />);

    wrapper.find(inputConfPassId).simulate('change', defaultEvent);
    wrapper.find(inputPassId).simulate('change', defaultEvent);
    wrapper.find(btnResetId).simulate('click', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    expect(spyChangeConfPass.calledOnce).to.equal(true);
    expect(spyChangePass.calledOnce).to.equal(true);
    expect(spyWillMount.calledOnce).to.equal(true);
    expect(spyBtnReset.calledOnce).to.equal(true);
    expect(spyBtnSave.calledOnce).to.equal(true);

    wrapper.unmount();
  });

  const mainId = '[data-test-id="EditUserPassword"]';
  const linkCancelId = '[data-test-id="btn-cancel"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<EditUserPassword {...props} />);

    expect(wrapper.find(mainId).exists()).equal(true);

    const editedNewPassword = props.stateData.password + ' new';
    wrapper.setProps({...props,
      stateData: {...props.stateData,
        password: editedNewPassword
      }
    });
    expect(wrapper.find(inputPassId).props().value).equal(editedNewPassword);

    const editedConfirmPassword = props.stateData.confirmPassword + ' new';
    wrapper.setProps({...props,
      stateData: {...props.stateData,
        confirmPassword: editedConfirmPassword
      }
    });
    expect(wrapper.find(inputConfPassId).props().value).equal(editedConfirmPassword);

    wrapper.setProps(props);
    expect(!!wrapper.find(btnSaveId).props().disabled).equal(false);

    const expectedLink = '/translator/' + defaultUser.id + '/edit';
    expect(wrapper.find(linkCancelId).props().to).equal(expectedLink);

    wrapper.unmount();
  });

  it('should disable save button on the component', () => {
    const wrapper = shallow(<EditUserPassword {...props} />);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        password: ''
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
        password: 'Valid password'
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      stateData: {...props.stateData,
        password: 'short'  // less than 6 characters
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.unmount();
  });
});
