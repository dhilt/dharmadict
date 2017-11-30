const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {appPath, initialState, users, translators, admin, languages, shallow} = require('../_shared.js');
const TranslatorPage = require(appPath + 'components/TranslatorPage').default.WrappedComponent;
const MountedTranslatorPage = require(appPath + 'components/TranslatorPage').default;

describe('Testing TranslatorPage Component.', () => {

  const user = users[0];
  const translator = translators[0];
  const props = {
    params: {
      id: translator.id
    },
    routeParams: {
      id: translator.id
    },
    common: { ...initialState.common,
      userLanguage: user.language,
      languages
    },
    userInfo: { ...initialState.auth.userInfo,
      data: user
    },
    translatorInfo: {
      pending: false,
      error: null,
      data: {
        name: translator.name,
        role: translator.role,
        language: translator.language,
        description: translator.description
      }
    }
  };

  it('should show component correctly', () => {
    const spy = sinon.spy(TranslatorPage.prototype, 'componentWillMount');
    const wrapper = shallow(<TranslatorPage {...props} dispatch={() => {}} />);

    const translatorPageId = '[data-test-id="TranslatorPage"]';
    expect(wrapper.find(translatorPageId).exists()).equal(true);
    expect(spy.calledOnce).to.equal(true);

    const translatorId = '[data-test-id="changeTranslatorPassword"]';
    const contentId = '[data-test-id="translatorContent"]';
    const adminId = '[data-test-id="changeUser"]';
    const pendingId = '[data-test-id="pending"]';
    const errorId = '[data-test-id="error"]';

    wrapper.setProps({...props,
      translatorInfo: {...props.translatorInfo,
        pending: true
      }
    });
    expect(wrapper.find(pendingId).exists()).equal(true);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(contentId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);

    wrapper.setProps({...props,
      translatorInfo: {...props.translatorInfo,
        error: 'Can\'t get translator data. Database error'
      }
    });
    expect(wrapper.find(errorId).exists()).equal(true);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(contentId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(false);

    wrapper.setProps(props);
    expect(wrapper.find(contentId).exists()).equal(true);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(false);
    const nameId = '[data-test-id="name"]';
    const descId = '[data-test-id="description"]';
    const langId = '[data-test-id="language"]';
    expect(wrapper.find(langId).exists()).equal(true);
    expect(wrapper.find(nameId).text()).equal(translator.name);
    expect(wrapper.find(descId).text()).equal(translator.description);

    wrapper.setProps({...props,
      userInfo: {
        data: translator
      }
    });
    expect(wrapper.find(translatorId).exists()).equal(true);
    expect(wrapper.find(adminId).exists()).equal(false);
    const refForTranslator = '/translator/' + translator.id + '/password';
    expect(wrapper.find(translatorId).props().to).equal(refForTranslator);

    wrapper.setProps({...props,
      userInfo: {
        data: admin
      }
    });
    expect(wrapper.find(adminId).exists()).equal(true);
    expect(wrapper.find(translatorId).exists()).equal(false);
    const refForAdmin = '/translator/' + translator.id + '/edit';
    expect(wrapper.find(adminId).props().to).equal(refForAdmin);

    wrapper.unmount();
  });

  it('should exists all i18n-texts for the component', () => {
    const arrIntlStringsId = [
      'TranslatorPage.translations_language',
      'TranslatorPage.button_edit',
      'TranslatorPage.button_edit_password',
      'TranslatorPage.loading_text'
    ];

    languages.forEach(lang => {
      const i18n = require(appPath + 'i18n/' + lang.id);
      arrIntlStringsId.forEach(elemId =>
        expect(i18n.hasOwnProperty(elemId)).equal(true)
      );
    });
  });

  it('should show i18n-texts on the component', () => {
    // Still can't change context of component...
  });
});
