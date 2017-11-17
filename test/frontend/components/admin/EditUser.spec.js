const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  languages,
  translators,
  userMutableProperties,
  _appPath
} = require('../../_shared.js');

const EditUser = require(_appPath + 'components/admin/EditUser').default;
const {getEditableUserDataObject} = require(_appPath + 'actions/admin/changeUser');

describe('Testing EditUser Component.', () => {

  const checkShowEditUser = (sourcePending, pending, error, sourceTranslator, editedTranslator) => {
    languages.forEach(lang => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id,
          languages
        },
        admin: { ...initialState.admin,
          editUser: { ...initialState.admin.editUser,
            id: sourceTranslator.id,
            dataSource: getEditableUserDataObject(sourceTranslator),
            data: getEditableUserDataObject(editedTranslator),
            pending,
            sourcePending,
            error
          }
        }
      };
      const _props = {
        params: {
          id: sourceTranslator.id
        },
        routeParams: {
          id: sourceTranslator.id
        }
      };
      const {wrapper} = setupComponent(EditUser, _initialState, _props);
      const i18n = require(_appPath + 'i18n/' + lang.id);

      if (sourcePending) {
        checkWrap(wrapper.find('[data-test-id="EditUser"]'), {
          length: 0
        });
        wrapper.unmount();
        return
      }

      checkWrap(wrapper.find('[data-test-id="EditUser"]'));

      checkWrap(wrapper.find('[data-test-id="main-form"]'), {
        className: 'col-md-6'
      });

      checkWrap(wrapper.find('[data-test-id="heading"]'), {
        text: i18n['EditUser.title_edit_user'].replace(`{id}`, sourceTranslator.id)
      });

      checkWrap(wrapper.find('[data-test-id="form-name"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-name"]'), {
        text: i18n['EditUser.name_of_translator']
      });

      checkWrap(wrapper.find('[data-test-id="input-name"]'), {
        className: 'form-control',
        value: editedTranslator.name,
        type: 'text'
      });

      checkWrap(wrapper.find('[data-test-id="form-lang"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-lang"]'), {
        text: i18n['EditUser.language_of_translations']
      });

      languages.forEach((language, languageIndex) => {

        checkWrap(wrapper.find('[data-test-id="radio-lang"]').at(languageIndex), {
          className: 'radio'
        });

        checkWrap(wrapper.find('[data-test-id="radio-label-lang"]').at(languageIndex), {
          text: language['name_' + lang.id]
        });

        checkWrap(wrapper.find('[data-test-id="input-lang"]').at(languageIndex), {
          checked: language.id === editedTranslator.language,
          name: 'lang_radio',
          type: 'radio'
        });
      });

      checkWrap(wrapper.find('[data-test-id="form-desc"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="label-desc"]'), {
        text: i18n['EditUser.description_of_translator']
      });

      checkWrap(wrapper.find('[data-test-id="textarea-desc"]'), {
        value: editedTranslator.description,
        className: 'form-control',
        type: 'text'
      });

      checkWrap(wrapper.find('[data-test-id="button-group"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="button-save"]'), {
        text: i18n['Common.save'],
        className: 'btn btn-primary',
        disabled: pending
      });

      checkWrap(wrapper.find('[data-test-id="button-reset"]'), {
        text: i18n['Common.reset'],
        className: 'btn btn-default'
      });

      checkWrap(wrapper.find('[data-test-id="button-cancel"]').first(), {
        text: i18n['Common.cancel']
      });

      checkWrap(wrapper.find('[data-test-id="password-group"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="link-password"]').first(), {
        text: i18n['EditUser.link_reset_password']
      });

      wrapper.unmount();
    });
  };

  translators.forEach(translator => {

    it(`should show the source pending component correctly`,
      () => checkShowEditUser(true, false, null, translator, translator)
    );

    it(`should show the component correctly`,
      () => checkShowEditUser(false, false, null, translator, translator)
    );

    it(`should show the pending component correctly`,
      () => checkShowEditUser(false, true, null, translator, translator)
    );

    it(`should show the component with fail request`,
      () => checkShowEditUser(false, true, 'Error message', translator, translator)
    );

    userMutableProperties.forEach(property => {
      let _translator = JSON.parse(JSON.stringify(translator));
      _translator[property] = 'New description of translator property'
      checkShowEditUser(false, false, null, translator, _translator);
    });
  });

  it('should correctly handle actions on component', () => {
    const defaultUser = translators[0];
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: defaultUser.language,
        languages
      },
      admin: { ...initialState.admin,
        editUser: { ...initialState.admin.editUser,
          id: defaultUser.id,
          dataSource: getEditableUserDataObject(defaultUser),
          data: getEditableUserDataObject(defaultUser)
        }
      }
    };
    const _props = {
      params: {
        id: defaultUser.id
      },
      routeParams: {
        id: defaultUser.id
      },
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(EditUser, _initialState, _props);

    let actionsCount = 1;  // component starts with the request
    checkWrapActions(store, actionsCount);

    wrapper.find('[data-test-id="input-name"]').props().onChange({target: {value: 'name'}});
    checkWrapActions(store, ++actionsCount);

    languages.forEach((lang, index) => {
      wrapper.find('[data-test-id="input-lang"]').at(index).props().onChange({target: {value: lang.id}});
      checkWrapActions(store, ++actionsCount);
    });

    wrapper.find('[data-test-id="textarea-desc"]').props().onChange({target: {value: 'desc'}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="button-save"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);

    wrapper.find('[data-test-id="button-reset"]').props().onClick({preventDefault: () => {}});
    checkWrapActions(store, ++actionsCount);
  });
});
