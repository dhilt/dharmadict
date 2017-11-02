const {setupComponent, checkWrap, initialState, _appPath} = require('../../_shared.js');
const ErrorMessage = require(_appPath + 'components/common/ErrorMessage').default;

describe('Testing ErrorMessage Component.', () => {

  it('should show the component', () => {
    const _props = {error: 'some error'};
    const wrapper = setupComponent(ErrorMessage, initialState, _props);

    checkWrap(wrapper.find('[data-test-id="ErrorMessage"]'), {
      className: 'form__error-wrapper js-form__err-animation'
    });

    checkWrap(wrapper.find('[data-test-id="ErrorMessage.text"]'), {
      className: 'form__error',
      text: _props.error
    });

    wrapper.unmount();
  });
});
