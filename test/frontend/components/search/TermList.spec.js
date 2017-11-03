global.window.localStorage = {};

const {setupComponent, checkWrap, initialState, terms, _appPath} = require('../../_shared.js');

const TermList = require(_appPath + 'components/search/TermList').default;

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
    const {wrapper} = setupComponent(TermList, _initialState);

    checkWrap(wrapper.find('[data-test-id="TermList"]'));

    terms.forEach(elem =>
      checkWrap(wrapper.find(`[data-test-id="${elem.wylie}"]`), {
        className: selectedTerm && elem === selectedTerm ? 'list-group-item selected' : 'list-group-item',
        text: elem.wylie
      })
    );

    wrapper.unmount();
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
