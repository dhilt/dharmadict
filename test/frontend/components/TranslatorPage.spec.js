const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  defaultTranslator,
  mountWithIntl,
  initialState,
  defaultUser,
  languages,
  shallow,
  getLang,
  appPath,
  admin
} = require('../_shared.js');

const TranslatorPage = require(appPath + 'components/TranslatorPage').default.WrappedComponent;

describe('Testing TranslatorPage Component.', () => {

  const props = {
    translatorInfo: {...initialState.translatorInfo,
      data: defaultTranslator
    },
    userInfo: {...initialState.auth.userInfo,
      data: defaultUser
    },
    common: {...initialState.common,
      userLanguage: defaultUser.language,
      languages
    },
    params: {
      id: defaultTranslator.id
    },
    routeParams: {
      id: defaultTranslator.id
    }
  };

  const translatorId = '[data-test-id="changeTranslatorPassword"]';
  const contentId = '[data-test-id="translatorContent"]';
  const adminId = '[data-test-id="changeUser"]';
  const pendingId = '[data-test-id="pending"]';
  const errorId = '[data-test-id="error"]';
  const descId = '[data-test-id="description"]';
  const langId = '[data-test-id="language"]';
  const nameId = '[data-test-id="name"]';

  it('should show component correctly', () => {
    const spy = sinon.spy(TranslatorPage.prototype, 'componentWillMount');
    const wrapper = shallow(<TranslatorPage {...props} />);

    expect(spy.calledOnce).equal(true);

    const translatorPageId = '[data-test-id="TranslatorPage"]';
    expect(wrapper.find(translatorPageId).exists()).equal(true);

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
    expect(wrapper.find(descId).text()).equal(defaultTranslator.description);
    expect(wrapper.find(nameId).text()).equal(defaultTranslator.name);
    expect(wrapper.find(langId).exists()).equal(true);

    wrapper.setProps({...props,
      userInfo: {
        data: defaultTranslator
      }
    });
    const refForTranslator = '/translator/' + defaultTranslator.id + '/password';
    expect(wrapper.find(translatorId).prop('to')).equal(refForTranslator);
    expect(wrapper.find(translatorId).exists()).equal(true);
    expect(wrapper.find(adminId).exists()).equal(false);

    wrapper.setProps({...props,
      userInfo: {
        data: admin
      }
    });
    const refForAdmin = '/translator/' + defaultTranslator.id + '/edit';
    expect(wrapper.find(adminId).prop('to')).equal(refForAdmin);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(true);

    wrapper.unmount();
  });

  const arrIntlStringsId = [
    [translatorId, 'TranslatorPage.button_edit_password'],
    [langId, 'TranslatorPage.translations_language'],
    [pendingId, 'TranslatorPage.loading_text'],
    [adminId, 'TranslatorPage.button_edit']
  ];

  languages.forEach(lang => {
    const i18n = require(appPath + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component ${lang.id}`, () =>
      arrIntlStringsId.forEach(couple =>
        expect(i18n.hasOwnProperty(couple[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component ${lang.id}`, () => {
      const wrapper = mountWithIntl(
        <TranslatorPage {...props} />, lang.id
      );

      const checkStringsWithoutValues = (wrapper, coupleStrings) =>
        expect(wrapper.find(coupleStrings[0]).first().text()).equal(i18n[coupleStrings[1]]);

      languages.forEach(translatorLang => {
        wrapper.setProps({...props,
          translatorInfo: {...props.translatorInfo,
            data: {...props.translatorInfo.data,
              language: translatorLang.id
            }
          },
          common: {...props.common,
            userLanguage: lang.id
          }
        });

        const langId = arrIntlStringsId[1];
        const existedStr = wrapper.find(langId[0]).text();
        const expectedStr = i18n[langId[1]].replace(
          '{translatorLanguage}',
          getLang(translatorLang.id)['name_' + lang.id]
        );
        expect(existedStr).equal(expectedStr);
      });

      wrapper.setProps({...props,
        translatorInfo: {...props.translatorInfo,
          pending: true
        }
      });
      checkStringsWithoutValues(wrapper, arrIntlStringsId[2]);

      wrapper.setProps({...props,
        userInfo: {...props.userInfo,
          data: admin
        }
      });
      checkStringsWithoutValues(wrapper, arrIntlStringsId[3]);

      wrapper.setProps({...props,
        translatorInfo: {...props.translatorInfo,
          data: defaultTranslator
        },
        userInfo: {...props.userInfo,
          data: defaultTranslator
        }
      });
      checkStringsWithoutValues(wrapper, arrIntlStringsId[0]);

      wrapper.unmount();
    });
  });
});
