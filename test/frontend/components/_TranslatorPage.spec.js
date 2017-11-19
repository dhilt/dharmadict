const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');
const {shallow, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });

const {initialState, users, translators, admin, languages, appPath} = require('../_shared.js');

const TestTranslatorPage = require(appPath + 'components/TranslatorPage').default.WrappedComponent;

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
        name: user.name,
        role: user.role,
        language: user.language,
        description: user.description
      }
    }
  };

  it('should show component correctly', () => {

    const spy = sinon.spy(TestTranslatorPage.prototype, 'componentWillMount');
    const wrapper = shallow(<TestTranslatorPage dispatch={() => {}} {...props} />);

    expect(wrapper.find('[data-test-id="TranslatorPage"]').exists()).equal(true);
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
    const i18nLoadingTextId = 'TranslatorPage.loading_text';
    expect(wrapper.find(pendingId).children().props().id).equal(i18nLoadingTextId);
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
    const i18nLangTextId = 'TranslatorPage.translations_language';
    expect(wrapper.find(nameId).text()).equal(user.name);
    expect(wrapper.find(descId).text()).equal(user.description);
    expect(wrapper.find(langId).children().props().id).equal(i18nLangTextId);
    expect(wrapper.find(langId).children().props().values.translatorLanguage)
      .equal(languages.find(e => e.id === user.language)['name_' + user.language]);

    wrapper.setProps({...props,
      userInfo: {
        data: translator
      }
    });
    expect(wrapper.find(translatorId).exists()).equal(true);
    expect(wrapper.find(adminId).exists()).equal(false);
    const refForTranslator = '/translator/' + translator.id + '/password';
    const i18nButtonForTranslator = 'TranslatorPage.button_edit_password';
    expect(wrapper.find(translatorId).props().to).equal(refForTranslator);
    expect(wrapper.find(translatorId).children().props().id).equal(i18nButtonForTranslator);

    wrapper.setProps({...props,
      userInfo: {
        data: admin
      }
    });
    expect(wrapper.find(adminId).exists()).equal(true);
    expect(wrapper.find(translatorId).exists()).equal(false);
    const refForAdmin = '/translator/' + translator.id + '/edit';
    const i18nButtonForAdmin = 'TranslatorPage.button_edit';
    expect(wrapper.find(adminId).props().to).equal(refForAdmin);
    expect(wrapper.find(adminId).children().props().id).equal(i18nButtonForAdmin);

    wrapper.unmount();
  });

  it('should exists all i18n-texts for the component', () => {
    languages.forEach(lang => {
      const i18n = require(appPath + 'i18n/' + lang.id);
      [
        'TranslatorPage.loading_text',
        'TranslatorPage.translations_language',
        'TranslatorPage.button_edit',
        'TranslatorPage.button_edit_password'
      ].forEach(elem => expect(i18n.hasOwnProperty(elem)).equal(true));
    });
  });
});
