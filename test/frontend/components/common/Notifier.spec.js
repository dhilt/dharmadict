global.window.localStorage = {};

const {
  setupComponent,
  checkWrap,
  initialState,
  languages,
  getNotificationAction,
  _appPath
} = require('../../_shared.js');

const Notifier = require(_appPath + 'components/common/Notifier').default;

describe('Testing Notifier Component.', () => {

  it('should show component with notifications', () => {
    languages.forEach(lang => {
      const countOfMessages = 5;
      const numberOfMessageWithValues = 1;
      const i18n = require(_appPath + 'i18n/' + lang.id);

      let notifications = {
        idLast: 0,
        list: []
      };

      for (let i = 0; i < countOfMessages; i++) {
        notifications.idLast++;
        notifications.list.push(getNotificationAction(null, Object.keys(i18n)[i]).notification);
      }

      // Message with values
      notifications.list[numberOfMessageWithValues] = getNotificationAction(null,
        Object.keys(i18n)[numberOfMessageWithValues], {
          error: 'error_message'
      }).notification;

      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id,
          languages
        },
        notifications
      };
      const wrapper = setupComponent(Notifier, _initialState);

      checkWrap(wrapper.find('[data-test-id="Notifier"]'), {
        className: 'alert-column'
      });

      for (let i = 0; i < countOfMessages; i++) {
        checkWrap(wrapper.find('div[data-test-id="Notifier.notification"]').at(i));
        checkWrap(wrapper.find('[data-test-id="Notifier.message"]').at(i), {
          text: i18n[i]
        });
      }

      wrapper.unmount();
    });
  });

  it('should show the component without notifications', () => {

    const wrapper = setupComponent(Notifier);

    checkWrap(wrapper.find('[data-test-id="Notifier"]'), {
      className: 'alert-column'
    });

    checkWrap(wrapper.find('[data-test-id="Notifier.notification"]'), {
      length: 0
    });

    wrapper.unmount();
  });
});
