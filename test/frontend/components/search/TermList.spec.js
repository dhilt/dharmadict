global.window.localStorage = {};
const {expect} = require('chai');

const TermList = require('../../../../app/components/search/TermList').default;
const {setupComponent, checkWrap, initialState, terms} = require('../../_shared.js');

describe('Testing TermList Component.', () => {

  const checkShowTermList = (terms, selectedTerm) => {
    const _initialState = { ...initialState,
      search: { ...initialState.search,
        started: true,
        result: terms,
        error: false,
        pending: false
      },
      selected: { ...initialState.selected,
        term: selectedTerm
      }
    };
    const wrapper = setupComponent(TermList, _initialState);

    checkWrap(wrapper.find('[data-test-id="TermList"]'));

    terms.forEach(elem =>
      checkWrap(wrapper.find(`[data-test-id="${elem.wylie}"]`), {
        className: selectedTerm && elem === selectedTerm ? 'list-group-item selected' : 'list-group-item',
        text: elem.wylie
      })
    );
  };

  const result = terms;
  const selectedTerm = terms[1];

  it('should show component with terms, without selected term', () =>
    checkShowTermList(terms, null)
  );

  it('should show component with terms, with selected term', () =>
    checkShowTermList(terms, selectedTerm)
  );
});
