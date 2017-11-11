const {setupComponent, checkWrap, initialState, _appPath} = require('../../_shared.js');
const LoadingButton = require(_appPath + 'components/common/LoadingButton').default;

describe('Testing LoadingButton Component.', () => {

  it('should show the component', () => {
    const _props = {className: 'some className'};
    const {wrapper} = setupComponent(LoadingButton, initialState, _props);

    checkWrap(wrapper.find('[data-test-id="LoadingButton"]'), {
      className: _props.className + ' btn btn--loading',
      disabled: 'true'
    });

    checkWrap(wrapper.find('[data-test-id="LoadingButton.LoadingIndicator"]'));

    wrapper.unmount();
  });
});
