const React = require('react');
const {expect} = require('chai');

const {
  getAppPath,
  shallow
} = require('../../_shared.js');

const ErrorMessage = require(getAppPath(2) + 'components/common/ErrorMessage').default;

describe('Testing ErrorMessage Component.', () => {

  const ErrorMessageId = '[data-test-id="ErrorMessage"]';
  const ErrorMessageTextId = '[data-test-id="ErrorMessage.text"]';

  it('should correctly show the component', () => {
    const wrapper = shallow(<ErrorMessage />);

    expect(wrapper.find(ErrorMessageId).exists()).equal(true);

    const givenErrorText = 'some error message';
    wrapper.setProps({
      error: givenErrorText
    });
    expect(wrapper.find(ErrorMessageTextId).text()).equal(givenErrorText);

    wrapper.unmount();
  });
});
