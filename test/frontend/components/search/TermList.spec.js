global.window.localStorage = {};
const {expect} = require('chai');

const TermList = require('../../../../app/components/search/TermList').default;
const {setupComponent, initialState, terms} = require('../../_shared.js');

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

    expect(wrapper.find('[data-test-id="TermList"]').length).equal(1);

    terms.forEach(elem => {
      const _term = wrapper.find(`[data-test-id="${elem.wylie}"]`);
      expect(_term.text()).equal(elem.wylie);
      if (selectedTerm && elem === selectedTerm) {
        expect(_term.props().className).equal('list-group-item selected');
      } else {
        expect(_term.props().className).equal('list-group-item');
      }
    })
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
