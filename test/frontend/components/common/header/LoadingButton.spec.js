const React = require('react');
const {expect} = require('chai');

const {
  getAppPath,
  shallow
} = require('../../../_shared.js');

const LoadingButton = require(getAppPath(3) + 'components/common/header/LoadingButton').default;

describe('Testing LoadingButton Component.', () => {

  const LoadingButtonId = '[data-test-id="LoadingButton"]';
  const nestedLoadingIndicatorId = '[data-test-id="LoadingButton.LoadingIndicator"]';

  it('should correctly show the component', () => {
    const wrapper = shallow(<LoadingButton />);

    expect(wrapper.find(LoadingButtonId).exists()).equal(true);
    expect(wrapper.find(nestedLoadingIndicatorId).exists()).equal(true);

    const givenClassName = 'some className';
    wrapper.setProps({
      className: givenClassName
    });
    expect(wrapper.find(LoadingButtonId).prop('className'))
      .equal(givenClassName + ' btn btn--loading');

    wrapper.unmount();
  });
});
