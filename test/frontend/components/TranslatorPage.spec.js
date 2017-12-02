const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {appPath, initialState, users, translators, admin, languages, shallow, mountWithIntl, getLang} = require('../_shared.js');
const TranslatorPage = require(appPath + 'components/TranslatorPage').default.WrappedComponent;

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
    common: {...initialState.common,
      userLanguage: user.language,
      languages
    },
    userInfo: {...initialState.auth.userInfo,
      data: user
    },
    translatorInfo: {...initialState.translatorInfo,
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

  const arrIntlStringsId = [
    ['[data-test-id="changeTranslatorPassword"]', 'TranslatorPage.button_edit_password'],
    ['[data-test-id="language"]', 'TranslatorPage.translations_language'],
    ['[data-test-id="changeUser"]', 'TranslatorPage.button_edit'],
    ['[data-test-id="pending"]', 'TranslatorPage.loading_text']
  ];

  it('should exists all i18n-texts for the component', () => {
    const _arrIntlStringsId = arrIntlStringsId.map(elem => elem[1]);

    languages.forEach(lang => {
      const i18n = require(appPath + 'i18n/' + lang.id);
      _arrIntlStringsId.forEach(elemId =>
        expect(i18n.hasOwnProperty(elemId)).equal(true)
      );
    });
  });

  it('should show i18n-texts on the component', () => {
    languages.forEach(userLang => {
      const wrapper = mountWithIntl(
        <TranslatorPage {...props} dispatch={() => {}} />, userLang.id
      );
      const i18n = require(appPath + 'i18n/' + userLang.id);

      const checkStringsWithoutValues = (wrapper, coupleStrings) => {
        const existedStr = wrapper.find(coupleStrings[0]).first().text();
        const expectedStr = i18n[coupleStrings[1]];
        return expect(existedStr).equal(expectedStr);
      };

      languages.forEach(translatorLang => {
        wrapper.setProps({...props,
          translatorInfo: {...props.translatorInfo,
            data: {...props.translatorInfo.data,
              language: translatorLang.id
            }
          },
          common: {...props.common,
            userLanguage: userLang.id
          }
        });

        const i18nCoupleId = arrIntlStringsId[1];
        const existedStr = wrapper.find(i18nCoupleId[0]).text();
        const expectedStr = i18n[i18nCoupleId[1]].replace(
          '{translatorLanguage}',
          getLang(translatorLang.id)['name_' + userLang.id]
        );
        expect(existedStr).equal(expectedStr);
      });

      wrapper.setProps({...props,
        translatorInfo: {...props.translatorInfo,
          pending: true
        }
      });
      checkStringsWithoutValues(wrapper, arrIntlStringsId[3]);

      wrapper.setProps({...props,
        userInfo: {...props.userInfo,
          data: admin
        }
      });
      checkStringsWithoutValues(wrapper, arrIntlStringsId[2]);

      wrapper.setProps({...props,
        translatorInfo: {...props.translatorInfo,
          data: translator
        },
        userInfo: {...props.userInfo,
          data: translator
        }
      });
      checkStringsWithoutValues(wrapper, arrIntlStringsId[0]);

      wrapper.unmount();
    });
  });
});
