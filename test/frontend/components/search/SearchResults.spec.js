global.window.localStorage = {};
const React = require('react');
const {Component} = require('react');
const {expect} = require('chai');

const SearchResults = require('../../../../app/components/search/SearchResults').default;
const {setupComponent, defaultLang, initialState, terms} = require('../../_shared.js');

const i18n = require('../../../../app/i18n/' + defaultLang);

describe('Testing SearchResults Component.', () => {

  const responseFail = {
    message: 'Error happened!'
  };

  const checkShowSearchResults = (result, selectedTerm, pending, error) => {
    const _initialState = { ...initialState,
      search: { ...initialState.search,
        started: true,
        result,
        error,
        pending
      },
      selected: { ...initialState.selected,
        term: selectedTerm
      }
    };
    const wrapper = setupComponent(SearchResults, _initialState);

    expect(wrapper.find('[data-test-id="SearchResults"]').length).equal(1);
    expect(wrapper.find('[data-test-id="SearchResults"]').hasClass('row')).equal(true);
    expect(wrapper.find('[data-test-id="SearchResults"]').hasClass('search-results-row')).equal(true);

    if (error) {
      expect(wrapper.find('[data-test-id="error"]').length).equal(1);
      expect(wrapper.find('[data-test-id="div-result"]').length).equal(0);
    }

    if (!pending && !result) {
      expect(wrapper.find('[data-test-id="not-found"]').length).equal(1);
      expect(wrapper.find('[data-test-id="not-found"]').text()).equal(i18n['SearchResults.Not_found']);
      expect(wrapper.find('[data-test-id="div-result"]').length).equal(0);
    }

    if (!pending && result) {
      expect(wrapper.find('[data-test-id="error"]').length).equal(0);
      expect(wrapper.find('[data-test-id="not-found"]').length).equal(0);

      expect(wrapper.find('[data-test-id="div-result"]').length).equal(1);

      expect(wrapper.find('[data-test-id="div-result.col-md-3"]').length).equal(1);
      expect(wrapper.find('[data-test-id="div-result.col-md-3"]').hasClass('col-md-3')).equal(true);

      expect(wrapper.find('[data-test-id="div-result.list"]').length).equal(1);
      expect(wrapper.find('[data-test-id="div-result.list"]').hasClass('list-group')).equal(true);
      expect(wrapper.find('[data-test-id="div-result.list"]').hasClass('terms')).equal(true);

      expect(wrapper.find('[data-test-id="TermList"]').length).equal(1);
      // further tests in "test/frontend/components/search/TermList"

      expect(wrapper.find('[data-test-id="selectedTerm"]').length).equal(1);
      expect(wrapper.find('[data-test-id="selectedTerm"]').hasClass('col-md-9')).equal(true);

      if (selectedTerm) {
        expect(wrapper.find('[data-test-id="Term"]').length).equal(1);
        expect(wrapper.find('[data-test-id="Term"]').hasClass('term')).equal(true);
        // further tests in "test/frontend/components/search/Term"
      }
    }
  };

  const result = terms;
  const selectedTerm = terms[1];

  it('should show component with initial empty data', () =>
    checkShowSearchResults(null, null, false, null)
  );
  it('should show component with term searching', () =>
    checkShowSearchResults(null, null, true, null)
  );
  it('should show component with success request, data received', () =>
    checkShowSearchResults(result, null, false, null)
  );
  it('should show component with success request, data received and term selected', () =>
    checkShowSearchResults(result, selectedTerm, false, null)
  );
  it('should show component with success request, data not received', () =>
    checkShowSearchResults(null, null, false, null)
  );
  it('should show component with error request', () =>
    checkShowSearchResults(null, null, false, responseFail)
  );
});
