const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  getNotificationAction,
  getIntlContext,
  mountWithIntl,
  getAppPath,
  languages
} = require('../../_shared.js');

const Notifier = require(getAppPath(2) + 'components/common/Notifier').default.WrappedComponent;

describe('Testing Notifier Component.', () => {

  const NotifierId = '[data-test-id="Notifier"]';
  const alertId = '[data-test-id="Notifier.notification"]';
  const messageId = '[data-test-id="Notifier.message"]';
  const spyCloseAlert = sinon.spy(Notifier.prototype, 'closeAlert');

  languages.forEach(lang => {
    const testIntlMessages = {
      'Test.Success_message_with_values': `Test success message on ${lang.id} {testId}`,
      'Test.Error_message_with_values': `Test error message on ${lang.id} {testId}`,
      'Test.Success_message': `Test success message on ${lang.id}`,
      'Test.Error_message': `Test error message on ${lang.id}`,
      'Test.Success_simple_message': '{testId}',
      'Test.Error_simple_message': '{testId}'
    };
    const arrTestIntlMsg = Object.keys(testIntlMessages);
    const intlSuccessText = 'It\'s intl success text ' + lang.id;
    const intlErrorText = 'It\'s intl error text ' + lang.id;
    const simpleSuccessText = 'It\' simple success text ' + lang.id;
    const simpleErrorText = 'It\' simple error text ' + lang.id;
    const emptyNotifications = {
      notifications: []
    };
    const props = {
      notifications: [
        // success simple text
        getNotificationAction(arrTestIntlMsg[4], false, {testId: simpleSuccessText}).notification,
        // error simple text
        getNotificationAction(false, arrTestIntlMsg[5], {testId: simpleErrorText}).notification,
        // success intl-message with values
        getNotificationAction(arrTestIntlMsg[0], false, {testId: intlSuccessText}).notification,
        // error intl-message with values
        getNotificationAction(false, arrTestIntlMsg[1], {testId: intlErrorText}).notification,
        // success intl-message without values
        getNotificationAction(arrTestIntlMsg[2], false).notification,
        // error intl-message without values
        getNotificationAction(false, arrTestIntlMsg[3]).notification
      ]
    };

    it(`should correctly show the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<Notifier {...emptyNotifications} />, lang.id);

      expect(wrapper.find(NotifierId).exists()).equal(true);

      wrapper.setContext({
        intl: getIntlContext(lang.id, testIntlMessages)
      });
      wrapper.setProps(props);

      props.notifications.forEach((notification, i) => {
        expect(wrapper.find(alertId).at(i * 2).prop('bsStyle')).equal(notification.type);
        // wrapper.find(alertId).at(i * 2).simulate('click');  // doesn't work
      });

      expect(wrapper.find(messageId).at(0).text()).equal(simpleSuccessText);
      expect(wrapper.find(messageId).at(1).text()).equal(simpleErrorText);
      expect(wrapper.find(messageId).at(4).text()).equal(testIntlMessages['Test.Success_message']);
      expect(wrapper.find(messageId).at(5).text()).equal(testIntlMessages['Test.Error_message']);
      expect(wrapper.find(messageId).at(2).text()).equal(
        testIntlMessages['Test.Success_message_with_values'].replace('{testId}', intlSuccessText)
      );
      expect(wrapper.find(messageId).at(3).text()).equal(
        testIntlMessages['Test.Error_message_with_values'].replace('{testId}', intlErrorText)
      );

      wrapper.unmount();
    });
  });
});
