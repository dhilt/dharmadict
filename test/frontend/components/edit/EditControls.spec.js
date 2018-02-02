const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  initialState,
  getAppPath,
  shallow
} = require('../../_shared.js');

const EditControls = require(getAppPath(2) + 'components/edit/EditControls').default.WrappedComponent;

describe('Testing EditControls Component.', () => {

  const props = {
    data: initialState.edit.update
  };

  const btnSaveAndCloseId = '[data-test-id="button-save-and-close"]';
  const linkCancelId = '[data-test-id="cancel-link"]';
  const btnSaveId = '[data-test-id="button-save"]';

  it('should correctly handle actions on the component', () => {
    const spyOnCancel = sinon.spy(EditControls.prototype, 'onCancel');
    const spyOnSave = sinon.spy(EditControls.prototype, 'onSave');

    const defaultEvent = {
      preventDefault: () => true,
      target: {
        value: 'password'
      }
    };
    const wrapper = shallow(<EditControls {...props} />);

    wrapper.find(btnSaveAndCloseId).simulate('click', defaultEvent);
    wrapper.find(linkCancelId).simulate('click', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    expect(spyOnCancel.calledOnce).to.equal(true);
    expect(spyOnSave.callCount).to.equal(2);

    wrapper.unmount();
  });

  const mainId = '[data-test-id="EditControls"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<EditControls {...props} />);

    expect(wrapper.find(mainId).exists()).equal(true);

    expect(wrapper.find(btnSaveAndCloseId).props().disabled).equal(false);
    expect(wrapper.find(btnSaveAndCloseId).props().className).equal('');
    expect(wrapper.find(btnSaveId).props().disabled).equal(false);
    expect(wrapper.find(btnSaveId).props().className).equal('');
    wrapper.setProps({...props,
      data: {...props.data,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveAndCloseId).props().className).equal('loader');
    expect(wrapper.find(btnSaveAndCloseId).props().disabled).equal(true);
    expect(wrapper.find(btnSaveId).props().className).equal('loader');
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.unmount();
  });
});
