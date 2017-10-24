global.window.localStorage = {};
const React = require('react');
const {Component} = require('react');
const {expect} = require('chai');

const Edit = require('../../../app/components/Edit').default;
const {setupComponent, translators, terms, initialState, defaultLang} = require('../_shared.js');

const i18n = require('../../../app/i18n/' + defaultLang);

describe('Testing Edit Component.', () => {

  const errorRequest = {
    message: 'Some error. Database error'
  };

  it('should show component with data', () => {
    const translator = translators[0];
    const term = terms[0];
    const translations = term.translations.find(elem => elem.translatorId === translator.id);
    const _initialState = { ...initialState,
      edit: { ...initialState.edit,
        started: true,
        termId: term.id,
        termName: term.wylie,
        source: translations,
        change: translations
      }
    }
    const query = {
      translatorId: translator.id,
      termId: term.id
    };
    const props = {
      location: {
        pathname: '/edit',
        query
      },
      query
    };
    const wrapper = setupComponent(Edit, _initialState, props);

    expect(wrapper.find('a.back-link')).to.exist;
    expect(wrapper.find('a.back-link').text()).equal(i18n['Edit.go_back']);
    expect(wrapper.find('ul.meaningList').length).equal(1);  // further test in 'Meanings.spec.js'

    // request error - should not be shown
    expect(wrapper.find('div.error').length).equal(0);
    // route params error and terms loading - should not be shown
    expect(wrapper.find('div > div').length).to.not.equal(1);
  });

  it('should show component with error: missing parameter (translatorId or termId)', () => {
    const translator = translators[0];
    const query = {
      translatorId: translator.id
    };
    const props = {
      location: {
        pathname: '/edit',
        query
      },
      query
    };
    const wrapper = setupComponent(Edit, initialState, props);

    expect(wrapper.find('a.back-link')).to.exist;
    expect(wrapper.find('a.back-link').text()).equal(i18n['Edit.go_back']);
    expect(wrapper.find('div > div').text()).equal(i18n['Edit.should_select_term']);

    // term translations - should not be shown
    expect(wrapper.find('ul.meaningList').length).equal(0);
    // request error - should not be shown
    expect(wrapper.find('div.error').length).equal(0);
    // terms loading - should not be shown
    expect(wrapper.find('div > div').text()).to.not.equal('Edit.query_is_performed');
  });

  it('should show component with data loading', () => {
    const translator = translators[0];
    const term = terms[0];
    const _initialState = { ...initialState,
      edit: { ...initialState.edit,
        pending: true
      }
    }
    const query = {
      translatorId: translator.id,
      termId: term.id
    };
    const props = {
      location: {
        pathname: '/edit',
        query
      },
      query
    };
    const wrapper = setupComponent(Edit, _initialState, props);

    expect(wrapper.find('a.back-link')).to.exist;
    expect(wrapper.find('a.back-link').text()).equal(i18n['Edit.go_back']);
    expect(wrapper.find('div > div').text()).equal(i18n['Edit.query_is_performed']);

    // term translations - should not be shown
    expect(wrapper.find('ul.meaningList').length).equal(0);
    // request error - should not be shown
    expect(wrapper.find('div.error').length).equal(0);
    // route params error - should not be shown
    expect(wrapper.find('div > div').text()).to.not.equal(i18n['Edit.should_select_term']);
  });

  it('should show component with error', () => {
    const translator = translators[0];
    const term = terms[0];
    const _initialState = { ...initialState,
      edit: { ...initialState.edit,
        error: errorRequest
      }
    }
    const query = {
      translatorId: translator.id,
      termId: term.id
    };
    const props = {
      location: {
        pathname: '/edit',
        query
      },
      query
    };
    const wrapper = setupComponent(Edit, _initialState, props);

    expect(wrapper.find('a.back-link')).to.exist;
    expect(wrapper.find('a.back-link').text()).equal(i18n['Edit.go_back']);
    expect(wrapper.find('div > div').find('span').text()).equal(i18n['Edit.request_error']);
    expect(wrapper.find('div > div > div').text()).equal(errorRequest.message);

    // term translations - should not be shown
    expect(wrapper.find('ul.meaningList').length).equal(0);
    // route params error and terms loading - should not be shown
    expect(wrapper.find('div > div').length).to.not.equal(1);
  });
});
