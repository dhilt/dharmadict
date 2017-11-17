const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  admin,
  users,
  translators,
  languages,
  appPath
} = require('../_shared.js');

const TranslatorPage = require(appPath + 'components/TranslatorPage').default;

describe('Testing TranslatorPage Component.', () => {

  const responseFail = {
    message: 'Can\'t get translator data. Database error'
  };

  const checkShowTranslatorPage = (translatorId, translatorInfo, error, pending, userLooking) => {
    const _initialState = { ...initialState,
      route: { ...initialState.route,
        location: { ...initialState.route.location,
          pathname: '/translator/' + translatorId
        }
      },
      common: { ...initialState.common,
        userLanguage: userLooking.language,
        languages
      },
      auth: { ...initialState.auth,
        userInfo: { ...initialState.auth.userInfo,
          data: userLooking
        }
      },
      translatorInfo: {
        pending,
        error,
        data: {
          name: translatorInfo ? translatorInfo.name : null,
          role: translatorInfo ? translatorInfo.role : null,
          language: translatorInfo ? translatorInfo.language : null,
          description: translatorInfo ? translatorInfo.description : null
        }
      }
    };
    const _props = {
      params: {
        id: translatorId
      },
      routeParams: {
        id: translatorId
      }
    };
    const {wrapper} = setupComponent(TranslatorPage, _initialState, _props);
    const i18n = require(appPath + 'i18n/' + userLooking.language);

    checkWrap(wrapper.find('[data-test-id="TranslatorPage"]'));

    // /* If this works, we will be able to make one pass for all users and translators */
    // wrapper.setProps({translatorInfo: {pending: true}}, () => {
    //   checkWrap(wrapper.find('[data-test-id="pending"]'));
    //   checkWrap(wrapper.find('[data-test-id="error"]'), { length: 0 });
    //   checkWrap(wrapper.find('[data-test-id="translatorContent"]'), { length: 0 });
    // });

    if (pending) {
      checkWrap(wrapper.find('[data-test-id="pending"]'), {
        text: i18n['TranslatorPage.loading_text']
      });

      checkWrap(wrapper.find('[data-test-id="error"]'), { length: 0 });
      checkWrap(wrapper.find('[data-test-id="translatorContent"]'), { length: 0 });
    }

    if (error) {
      checkWrap(wrapper.find('[data-test-id="error"]'), {
        text: responseFail.message
      });

      checkWrap(wrapper.find('[data-test-id="pending"]'), { length: 0 });
      checkWrap(wrapper.find('[data-test-id="translatorContent"]'), { length: 0 });
    }

    if (!error && !pending) {
      checkWrap(wrapper.find('[data-test-id="translatorContent"]'));

      checkWrap(wrapper.find('[data-test-id="name"]'), {
        text: translatorInfo.name
      });

      const translatorLang = languages.find(elem => elem.id === translatorInfo.language);
      const showingLanguage = translatorLang[`name_${userLooking.language}`];
      checkWrap(wrapper.find('[data-test-id="language"]'), {
        text: i18n['TranslatorPage.translations_language'].replace('{translatorLanguage}', showingLanguage)
      });

      checkWrap(wrapper.find('[data-test-id="description"]'), {
        text: translatorInfo.description
      });

      checkWrap(wrapper.find('[data-test-id="pending"]'), { length: 0 });
      checkWrap(wrapper.find('[data-test-id="error"]'), { length: 0 });
    }

    if (userLooking.role === 'admin') {
      checkWrap(wrapper.find('[data-test-id="changeUser"]').first(), {
        text: i18n['TranslatorPage.button_edit'],
        className: 'btn btn-default'
      })
    } else {
      checkWrap(wrapper.find('[data-test-id="changeUser"]'), { length: 0 });
    }

    if (userLooking.role === 'translator' && userLooking.id === translatorInfo.id) {
      checkWrap(wrapper.find('[data-test-id="changeTranslatorPassword"]').first(), {
        text: i18n['TranslatorPage.button_edit_password'],
        className: 'btn btn-default'
      })
    } else {
      checkWrap(wrapper.find('[data-test-id="changeTranslatorPassword"]'), { length: 0 });
    }

    wrapper.unmount();
  };

  const defaultUser = users[0];
  const defaultTranslator = translators[0];
  const mockId = 'ID';

  it('should show component sending request',
    () => checkShowTranslatorPage(mockId, null, null, true, defaultUser)
  );

  it('should show component showing the error',
    () => checkShowTranslatorPage(mockId, null, responseFail, false, defaultUser)
  );

  it('should show component with data for admin',
    () => checkShowTranslatorPage(defaultTranslator.id, defaultTranslator, null, false, admin)
  );

  translators.forEach(translator => {

    it(`should show component with data ${translator.id} for defaultTranslator`,
      () => checkShowTranslatorPage(translator.id, translator, null, false, defaultTranslator)
    );

    users.forEach(user =>
      it(`should show component with data ${translator.id} for ${user.name}`,
        () => checkShowTranslatorPage(translator.id, translator, null, false, user)
      )
    );
  });

  it('should correctly handle actions on component', () => {
    const _props = {
      params: { id: 'ID' },
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(TranslatorPage, initialState, _props);

    let actionsCount = 1;  // component starts with the request
    checkWrapActions(store, actionsCount);
  });
});
