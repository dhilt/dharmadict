const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  mountWithIntl,
  initialState,
  languages,
  _appPath,
  shallow
} = require('../../../_shared.js');

const Login = require('../' + _appPath + 'components/common/header/Login').default;

describe('Testing Login Component.', () => {

  const defaultEvent = {
    preventDefault: () => true,
    target: {
      value: 'some words'
    }
  };
  const props = {
    data: initialState.auth,
    onPasswordChange: sinon.spy(),
    onLoginChange: sinon.spy(),
    closeModal: sinon.spy(),
    openModal: sinon.spy(),
    doLogin: sinon.spy()
  };

  const LoginId = '[data-test-id="Login"]';
  const btnOpenModalId = '[data-test-id="Login.link_open_modal"]';
  const btnCloseModalId = '[data-test-id="Login.button_cancel"]';
  const btnDoLoginId = '[data-test-id="Login.button_do_login"]';
  const inputPassId = '[data-test-id="Login.input-password"]';
  const inputLoginId = '[data-test-id="Login.input-login"]';

  it('should correctly handle actions', () => {
    const wrapper = shallow(<Login {...props} />);

    wrapper.find(btnCloseModalId).simulate('click', defaultEvent);
    wrapper.find(btnOpenModalId).simulate('click', defaultEvent);
    wrapper.find(inputLoginId).simulate('change', defaultEvent);
    wrapper.find(inputPassId).simulate('change', defaultEvent);
    wrapper.find(btnDoLoginId).simulate('click', defaultEvent);

    expect(props.onPasswordChange.calledOnce).equal(true);
    expect(props.onLoginChange.calledOnce).equal(true);
    expect(props.closeModal.calledOnce).equal(true);
    expect(props.openModal.calledOnce).equal(true);
    expect(props.doLogin.calledOnce).equal(true);

    wrapper.unmount();
  });

  const modalId = '[data-test-id="Login.modal"]';
  const authFormId = '[data-test-id="Login.auth-form"]';

  it('should show component correctly', () => {
    const wrapper = mountWithIntl(<Login {...props} />);

    expect(wrapper.find(LoginId).exists()).equal(true);
    expect(wrapper.find(modalId).exists()).equal(true);

    expect(wrapper.find(modalId).prop('isOpen')).equal(props.data.modalIsOpen);
    expect(wrapper.find(authFormId).exists()).equal(props.data.modalIsOpen);
    wrapper.setProps({...props,
      data: {...props.data,
        modalIsOpen: true
      }
    });
    expect(wrapper.find(modalId).prop('isOpen')).equal(true);
    // expect(wrapper.find(authFormId).exists()).equal(true);  /// should work

    wrapper.unmount();
  });
});
