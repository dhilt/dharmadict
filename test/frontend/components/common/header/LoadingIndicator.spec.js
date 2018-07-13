const React = require('react');
const {expect} = require('chai');

const {
  getAppPath,
  shallow
} = require('../../../_shared.js');

const LoadingIndicator = require(getAppPath(3) + 'components/common/header/LoadingIndicator').default;

describe('Testing LoadingIndicator Component.', () => {

  const LoadingIndicatorId = '[data-test-id="LoadingIndicator"]';

  it('should correctly show the component', () => {
    const wrapper = shallow(<LoadingIndicator />);
    expect(wrapper.find(LoadingIndicatorId).exists()).equal(true);
    wrapper.unmount();
  });
});
