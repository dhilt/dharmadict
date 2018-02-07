const React = require('react');
const {expect} = require('chai');

const {
  mountWithIntl,
  initialState,
  defaultTerm,
  defaultLang,
  getAppPath,
  shallow,
  terms
} = require('../../_shared.js');

const SearchResults = require(getAppPath(2) + 'components/search/SearchResults').default.WrappedComponent;

describe('Testing SearchResults Component.', () => {

  const props = {
    getSelectedTerm: () => false,
    data: initialState.search
  };

  const mainId = '[data-test-id="SearchResults"]';
  const resultId = '[data-test-id="div-result"]';
  const notFoundId = '[data-test-id="not-found"]';
  const errorId = '[data-test-id="error"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<SearchResults {...props} />);

    expect(wrapper.find(mainId).exists()).equal(true);

    wrapper.setProps({...props,
      data: {...props.data,
        pending: false,
        started: true,
        result: terms
      }
    });
    expect(wrapper.find(resultId).exists()).equal(true);
    expect(wrapper.find(notFoundId).exists()).equal(false);

    wrapper.setProps({...props,
      data: {...props.data,
        pending: false,
        started: true,
        result: null
      }
    });
    expect(wrapper.find(notFoundId).exists()).equal(true);
    expect(wrapper.find(resultId).exists()).equal(false);

    wrapper.setProps({...props,
      data: {...props.data,
        error: null
      }
    });
    expect(wrapper.find(errorId).exists()).equal(false);

    const errMsg = 'error message';
    wrapper.setProps({...props,
      data: {...props.data,
        error: {
          message: errMsg
        }
      }
    });
    expect(wrapper.find(errorId).text()).equal(errMsg);

    wrapper.unmount();
  });

  it('should contain components Term and TermList inside', () => {
    const _props = {...initialState,
      getSelectedTerm: () => true,
      data: {...props.data,
        pending: false,
        started: true,
        result: terms
      }
    };
    const _initialState = {...initialState,
      selected: {
        term: defaultTerm
      }
    };
    const wrapper = mountWithIntl(
      <SearchResults {..._props} />, defaultLang, _initialState
    );

    const termListId = '[data-test-id="TermList"]';
    const termId = '[data-test-id="Term"]';

    expect(wrapper.find(termListId).exists()).equal(true);
    expect(wrapper.find(termId).exists()).equal(true);

    wrapper.unmount();
  });
});
