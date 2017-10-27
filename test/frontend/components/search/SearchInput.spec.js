global.window.localStorage = {};
const React = require('react');
const {Component} = require('react');
const {expect} = require('chai');

const SearchInput = require('../../../../app/components/search/SearchInput').default;
const {setupComponent, defaultLang, initialState} = require('../../_shared.js');

const i18n = require('../../../../app/i18n/' + defaultLang);

describe('Testing SearchInput Component.', () => {

  const checkShowSearchInput = (searchString, pending) => {
    const _initialState = { ...initialState,
      search: { ...initialState.search,
        searchString,
        pending
      }
    };
    const wrapper = setupComponent(SearchInput, _initialState);

    expect(wrapper.find('[data-test-id="SearchInput"]').length).equal(1);
    expect(wrapper.find('[data-test-id="SearchInput"]').hasClass('row')).equal(true);

    expect(wrapper.find('[data-test-id="main-form"]').length).equal(1);

    expect(wrapper.find('[data-test-id="form-group1"]').length).equal(1);
    expect(wrapper.find('[data-test-id="form-group1"]').hasClass('form-group')).equal(true);

    expect(wrapper.find('[data-test-id="form-group1.col-md-6"]').length).equal(1);
    expect(wrapper.find('[data-test-id="form-group1.col-md-6"]').hasClass('col-md-6')).equal(true);

    expect(wrapper.find('[data-test-id="form-group1.input"]').length).equal(1);
    expect(wrapper.find('[data-test-id="form-group1.input"]').hasClass('form-control')).equal(true);
    expect(wrapper.find('[data-test-id="form-group1.input"]').hasClass('col-md-7')).equal(true);
    expect(wrapper.find('[data-test-id="form-group1.input"]').props().name).equal('search');
    expect(wrapper.find('[data-test-id="form-group1.input"]').props().type).equal('search');
    expect(wrapper.find('[data-test-id="form-group1.input"]').props().value).equal(searchString);

    expect(wrapper.find('[data-test-id="div.col-md-2"]').length).equal(1);
    expect(wrapper.find('[data-test-id="div.col-md-2"]').hasClass('col-md-2')).equal(true);

    expect(wrapper.find('[data-test-id="form-group2"]').length).equal(1);
    expect(wrapper.find('[data-test-id="form-group2"]').hasClass('form-group')).equal(true);

    expect(wrapper.find('button[data-test-id="searchButton"]').length).equal(1);
    expect(wrapper.find('button[data-test-id="searchButton"]').props().disabled).equal(!searchString || pending);
    expect(wrapper.find('button[data-test-id="searchButton"]').hasClass('loader')).not.to.equal(!pending);
    expect(wrapper.find('button[data-test-id="searchButton"]').props().type).equal('submit');

    expect(wrapper.find('[data-test-id="button-pending"]').length).equal(1);
    expect(wrapper.find('[data-test-id="button-pending"]').hasClass('invisible')).not.to.equal(!pending);
    expect(wrapper.find('[data-test-id="button-pending"]').text()).equal(i18n['SearchInput.button_find']);
  };

  it('should show component with initial empty data', () => checkShowSearchInput('', false));
  it('should show component with term searching', () => checkShowSearchInput('term', true));
  it('should show component ready for term searching', () => checkShowSearchInput('term', false));
});
