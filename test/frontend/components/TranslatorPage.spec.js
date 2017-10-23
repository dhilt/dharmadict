global.window.localStorage = {};
const React = require('react');
const {Component} = require('react');
const {expect} = require('chai');

const TranslatorPage = require('../../../app/components/TranslatorPage').default;
const {setupComponent, defaultLang, initialState, translators, languages} = require('../_shared.js');

const i18n = require('../../../app/i18n/' + defaultLang);

describe('Testing TranslatorPage Component.', () => {

  const errorMessage = 'Can\'t get translator data. Database error';

  it('should show component with received translator data', () => {
    const translator = translators[0];
    const _initialState = { ...initialState,
      route: { ...initialState.route,
        location: { ...initialState.route.location,
          pathname: '/translator/' + translator.id
        }
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
      },
      common: {
        languages
      }
    };
    const props = {
      params: {
        id: translator.id
      },
      routeParams: {
        id: translator.id
      }
    };
    const {wrapper} = setupComponent(TranslatorPage, _initialState, props);
    let expectedLangDescription = i18n['TranslatorPage.translations_language'];
    expectedLangDescription = expectedLangDescription.replace(/{translatorLanguage}/g, '');
    expectedLangDescription += languages.find(e => e.id === defaultLang)['name_' + defaultLang];

    expect(wrapper.find('div')).to.exist;
    expect(wrapper.find('h3').text()).equal(translator.name);
    expect(wrapper.find('h4').text()).equal(expectedLangDescription);
    expect(wrapper.find('pre').text()).equal(translator.description);

    // it's hidden admin panel - should not be shown
    expect(wrapper.find('a').length).equal(0);
    // it's loading message - should not be shown
    expect(wrapper.find('h3').text()).to.not.equal(i18n['TranslatorPage.loading_text']);
    // it's error message - should not be shown
    expect(wrapper.find('h3').text()).to.not.equal(errorMessage);
  });

  it('should show component with waiting for data', () => {
    const translator = translators[0];
    const _initialState = { ...initialState,
      route: { ...initialState.route,
        location: { ...initialState.route.location,
          pathname: '/translator/' + translator.id
        }
      },
      translatorInfo: { ...initialState.translatorInfo,
        pending: true,
        error: null
      },
      common: {
        languages
      }
    };
    const props = {
      params: {
        id: translator.id
      },
      routeParams: {
        id: translator.id
      }
    };
    const {wrapper} = setupComponent(TranslatorPage, _initialState, props);

    expect(wrapper.find('div')).to.exist;
    expect(wrapper.find('h3').text()).equal(i18n['TranslatorPage.loading_text']);

    // it's hidden admin panel - should not be shown
    expect(wrapper.find('a').length).equal(0);
    // it's error message - should not be shown
    expect(wrapper.find('h3').text()).to.not.equal(errorMessage);
    // it's translator data - should not be shown
    expect(wrapper.find('pre').length).equal(0);
  });

  it('should show component with error', () => {
    const translator = translators[0];
    const _initialState = { ...initialState,
      route: { ...initialState.route,
        location: { ...initialState.route.location,
          pathname: '/translator/' + translator.id
        }
      },
      translatorInfo: { ...initialState.translatorInfo,
        pending: false,
        error: {
          error: true,
          code: 500,
          message: errorMessage
        }
      },
      common: {
        languages
      }
    };
    const props = {
      params: {
        id: translator.id
      },
      routeParams: {
        id: translator.id
      }
    };
    const {wrapper} = setupComponent(TranslatorPage, _initialState, props);

    expect(wrapper.find('div')).to.exist;
    expect(wrapper.find('h3').text()).equal(errorMessage);

    // it's hidden admin panel - should not be shown
    expect(wrapper.find('a').length).equal(0);
    // it's loading message - should not be shown
    expect(wrapper.find('h3').text()).to.not.equal(i18n['TranslatorPage.loading_text']);
    // it's translator data - should not be shown
    expect(wrapper.find('pre').length).equal(0);
  });

  it('should show component with admin capabilities', () => {
    const translator = translators[0];
    const _initialState = { ...initialState,
      route: { ...initialState.route,
        location: { ...initialState.route.location,
          pathname: '/translator/' + translator.id
        }
      },
      auth: { ...initialState.auth,
        userInfo: { ...initialState.auth.userInfo,
          data: { ...initialState.auth.userInfo.data,
            role: 'admin'
          }
        }
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
      },
      common: {
        languages
      }
    };
    const props = {
      params: {
        id: translator.id
      },
      routeParams: {
        id: translator.id
      }
    };
    const {wrapper} = setupComponent(TranslatorPage, _initialState, props);
    let expectedLangDescription = i18n['TranslatorPage.translations_language'];
    expectedLangDescription = expectedLangDescription.replace(/{translatorLanguage}/g, '');
    expectedLangDescription += languages.find(e => e.id === defaultLang)['name_' + defaultLang];

    expect(wrapper.find('div')).to.exist;
    expect(wrapper.find('h3').text()).equal(translator.name);
    expect(wrapper.find('h4').text()).equal(expectedLangDescription);
    expect(wrapper.find('pre').text()).equal(translator.description);
    expect(wrapper.find('a').text()).equal(i18n['TranslatorPage.button_edit']);
    expect(wrapper.find('a').hasClass('btn')).equal(true);
    expect(wrapper.find('a').hasClass('btn-default')).equal(true);

    // it's error message - should not be shown
    expect(wrapper.find('h3').text()).to.not.equal(errorMessage);
    // it's loading message - should not be shown
    expect(wrapper.find('h3').text()).to.not.equal(i18n['TranslatorPage.loading_text']);
  });
});