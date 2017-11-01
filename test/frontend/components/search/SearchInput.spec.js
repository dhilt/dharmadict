global.window.localStorage = {};
const {expect} = require('chai');

const SearchInput = require('../../../../app/components/search/SearchInput').default;
const {setupComponent, checkWrap, initialState, languages} = require('../../_shared.js');

describe('Testing SearchInput Component.', () => {

  const checkShowSearchInput = (searchString, pending, lang) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: lang
      },
      search: { ...initialState.search,
        searchString,
        pending
      }
    };
    const wrapper = setupComponent(SearchInput, _initialState);
    const i18n = require('../../../../app/i18n/' + lang);

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
  };

  languages.forEach(lang => {
    it('should show component with initial empty data', () => checkShowSearchInput('', false, lang.id));
    it('should show component with term searching', () => checkShowSearchInput('term', true, lang.id));
    it('should show component ready for term searching', () => checkShowSearchInput('term', false, lang.id));
  });
});
