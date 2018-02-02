const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {initialState, getAppPath, shallow} = require('../../_shared.js');

const SearchInput = require(getAppPath(2) + 'components/search/SearchInput').default.WrappedComponent;

describe('Testing SearchInput Component.', () => {

  const props = {
    data: initialState.search
  };

  const inputSearchId = '[data-test-id="search-string-input"]';
  const btnSearchId = '[data-test-id="searchButton"]';

  it('should correctly handle actions on the component', () => {
    const spySearchString = sinon.spy(SearchInput.prototype, 'onSearchStringChange');
    const spyOnSubmit = sinon.spy(SearchInput.prototype, 'onSubmit');

    const defaultEvent = {
      preventDefault: () => true,
      target: {
        value: 'searched word'
      }
    };
    const wrapper = shallow(<SearchInput {...props} />);

    wrapper.find(inputSearchId).simulate('change', defaultEvent);
    wrapper.find(btnSearchId).simulate('click', defaultEvent);

    expect(spySearchString.calledOnce).equal(true);
    expect(spyOnSubmit.calledOnce).equal(true);

    wrapper.unmount();
  });

  const mainId = '[data-test-id="SearchInput"]';
  const btnSearchTextId = '[data-test-id="text-btn-search"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<SearchInput {...props} />);

    expect(wrapper.find(mainId).exists()).equal(true);

    const editedSearchString = props.data.searchString + ' new';
    wrapper.setProps({...props,
      data: {...props.data,
        searchString: editedSearchString
      }
    });
    expect(wrapper.find(inputSearchId).props().value).equal(editedSearchString);

    wrapper.setProps({...props,
      data: {...props.data,
        pending: false
      }
    });
    expect(wrapper.find(btnSearchTextId).props().className).equal('');
    expect(wrapper.find(btnSearchId).props().className).equal('');

    wrapper.setProps({...props,
      data: {...props.data,
        pending: true
      }
    });
    expect(wrapper.find(btnSearchTextId).props().className).equal('invisible');
    expect(wrapper.find(btnSearchId).props().className).equal('loader');

    wrapper.unmount();
  });

  it('should disable button on the component', () => {
    const wrapper = shallow(<SearchInput {...props} />);

    wrapper.setProps({...props,
      data: {...props.data,
        searchString: ''
      }
    });
    expect(wrapper.find(btnSearchId).props().disabled).equal(true);

    wrapper.setProps({...props,
      data: {...props.data,
        pending: true
      }
    });
    expect(wrapper.find(btnSearchId).props().disabled).equal(true);

    wrapper.setProps({...props,
      data: {...props.data,
        searchString: '',
        pending: true
      }
    });
    expect(wrapper.find(btnSearchId).props().disabled).equal(true);

    wrapper.setProps({...props,
      data: {...props.data,
        searchString: 'searched string',
        pending: false
      }
    });
    expect(wrapper.find(btnSearchId).props().disabled).equal(false);

    wrapper.unmount();
  });
});
