global.window.localStorage = {};

const EditControls = require('../../../../app/components/edit/EditControls').default;
const {setupComponent, checkWrap, initialState, languages} = require('../../_shared.js');

describe('Testing EditControls Component.', () => {

  const checkShowEditControls = (pending, lang) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: lang,
      },
      edit: { ...initialState.edit,
        update: { ...initialState.edit.update,
          pending: pending
        }
      }
    };
    const wrapper = setupComponent(EditControls, _initialState);
    const i18n = require('../../../../app/i18n/' + lang);

    checkWrap(wrapper.find('[data-test-id="EditControls"]'), {
      className: 'form-group form-inline'
    });

    checkWrap(wrapper.find('button[data-test-id="button-save-and-close"]'), {
      text: i18n['EditControls.button_save_and_close'],
      className: pending ? 'loader' : '',
      disabled: pending,
      type: 'button'
    });

    checkWrap(wrapper.find('button[data-test-id="button-save"]'), {
      text: i18n['EditControls.button_save'],
      className: pending ? 'loader' : '',
      disabled: pending,
      type: 'button'
    });

    checkWrap(wrapper.find('a[data-test-id="cancel-link"]'), {
      text: i18n['EditControls.button_reset'],
      className: 'cancel-link'
    });

    wrapper.unmount();
  };

  languages.forEach(lang => {

    it('should show component, that is sending the request',
      () => checkShowEditControls(true, lang.id)
    );

    it('should show component, that is not sending the request',
      () => checkShowEditControls(false, lang.id)
    );
  });
});
