global.window.localStorage = {};

const {setupComponent, checkWrap, languages, initialState, terms, _appPath} = require('../../_shared.js');

const SearchResults = require(_appPath + 'components/search/SearchResults').default;

describe('Testing SearchResults Component.', () => {

  const responseFail = {
    message: 'Error happened!'
  };

  const checkShowSearchResults = (result, selectedTerm, pending, error) => {
    languages.forEach(lang => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        },
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
      const i18n = require(_appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="SearchResults"]'), {
        className: 'row search-results-row'
      });

      if (error) {
        checkWrap(wrapper.find('[data-test-id="error"]'));
        checkWrap(wrapper.find('[data-test-id="div-result"]'), { length: 0 });
      }

      if (!pending && !result) {
        checkWrap(wrapper.find('[data-test-id="not-found"]'), {
          text: i18n['SearchResults.Not_found']
        });
        checkWrap(wrapper.find('[data-test-id="div-result"]'), { length: 0 });
      }

      if (!pending && result) {
        checkWrap(wrapper.find('[data-test-id="error"]'), { length: 0 });
        checkWrap(wrapper.find('[data-test-id="not-found"]'), { length: 0 });

        checkWrap(wrapper.find('[data-test-id="div-result"]'));

        checkWrap(wrapper.find('[data-test-id="div-result.col-md-3"]'), {
          className: 'col-md-3'
        });

        checkWrap(wrapper.find('[data-test-id="div-result.list"]'), {
          className: 'list-group terms'
        });

        checkWrap(wrapper.find('[data-test-id="TermList"]'));
        // further tests in "test/frontend/components/search/TermList"

        checkWrap(wrapper.find('[data-test-id="selectedTerm"]'), {
          className: 'col-md-9'
        });

        if (selectedTerm) {
          checkWrap(wrapper.find('[data-test-id="Term"]'), {
            className: 'term'
          })
          // further tests in "test/frontend/components/search/Term"
        }
      }

      wrapper.unmount();
    });
  };

  const result = terms;
  const selectedTerm = terms[1];

  it('should show component with initial empty data',
    () => checkShowSearchResults(null, null, false, null)
  );
  it('should show component with term searching',
    () => checkShowSearchResults(null, null, true, null)
  );
  it('should show component with success request, data received',
    () => checkShowSearchResults(result, null, false, null)
  );
  it('should show component with success request, data received and term selected',
    () => checkShowSearchResults(result, selectedTerm, false, null)
  );
  it('should show component with success request, data not received',
    () => checkShowSearchResults(null, null, false, null)
  );
  it('should show component with error request',
    () => checkShowSearchResults(null, null, false, responseFail)
  );
  it('should show component with error request and starting new request',
    () => checkShowSearchResults(null, null, true, responseFail)
  );
});
