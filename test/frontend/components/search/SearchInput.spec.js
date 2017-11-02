global.window.localStorage = {};

const SearchInput = require('../../../../app/components/search/SearchInput').default;
const {setupComponent, checkWrap, initialState, languages} = require('../../_shared.js');

describe('Testing SearchInput Component.', () => {

  const checkShowSearchInput = (searchString, pending) => {
    languages.forEach(lang => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        },
        search: { ...initialState.search,
          searchString,
          pending
        }
      };
      const wrapper = setupComponent(SearchInput, _initialState);
      const i18n = require('../../../../app/i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="SearchInput"]'), {
        className: 'row'
      });

      checkWrap(wrapper.find('[data-test-id="main-form"]'));

      checkWrap(wrapper.find('[data-test-id="form-group1"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('[data-test-id="form-group1.col-md-6"]'), {
        className: 'col-md-6'
      });

      checkWrap(wrapper.find('[data-test-id="form-group1.input"]'), {
        className: 'form-control col-md-7',
        name: 'search',
        type: 'search',
        value: searchString
      });

      checkWrap(wrapper.find('[data-test-id="div.col-md-2"]'), {
        className: 'col-md-2'
      });

      checkWrap(wrapper.find('[data-test-id="form-group2"]'), {
        className: 'form-group'
      });

      checkWrap(wrapper.find('button[data-test-id="searchButton"]'), {
        disabled: !searchString || pending,
        className: pending ? 'loader' : '',
        type: 'submit'
      });

      checkWrap(wrapper.find('[data-test-id="button-pending"]'), {
        text: i18n['SearchInput.button_find'],
        className: pending ? 'invisible' : ''
      });

      wrapper.unmount();
    });
  };

  it('should show component with initial empty data',
    () => checkShowSearchInput('', false)
  );
  it('should show component with term searching',
    () => checkShowSearchInput('term', true)
  );
  it('should show component ready for term searching',
    () => checkShowSearchInput('term', false)
  );
});
