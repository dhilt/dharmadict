const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {initialState, appPath, shallow, pages, admin} = require('../_shared.js');

const Pages = require(appPath + 'components/Pages').default.WrappedComponent;

describe('Testing Pages Component.', () => {

  const props = {
    pages: {
      pending: false,
      list: []
    },
    userData: null
  };

  const pagesId = '[data-test-id="Pages"]';
  const listPagesId = '[data-test-id="list-pages"]';
  const linkCreateId = '[data-test-id="link-to-create"]';

  it('should correctly handle actions on the component', () => {
    const spyComponentWillMount = sinon.spy(Pages.prototype, 'componentWillMount');

    const wrapper = shallow(<Pages {...props} />);
    expect(spyComponentWillMount.calledOnce).equal(true);

    wrapper.unmount();
  });

  it('should show component correctly', () => {
    const wrapper = shallow(<Pages {...props} />);

    expect(wrapper.find(pagesId).exists()).equal(true);

    expect(wrapper.find(listPagesId).exists()).equal(true);
    wrapper.setProps({...props,
      pages: {...props.pages,
        pending: true
      }
    });
    expect(wrapper.find(linkCreateId).exists()).equal(false);

    wrapper.setProps(props);
    expect(wrapper.find(linkCreateId).exists()).equal(false);

    wrapper.setProps({...props,
      userData: {...props.userData,
        role: 'admin'
      }
    });
    expect(wrapper.find(linkCreateId).exists()).equal(true);

    wrapper.unmount();
  });

  it('should show list of pages correctly', () => {
    const wrapper = shallow(<Pages {...props} />);

    wrapper.setProps({...props,
      pages: {...props.pages,
        list: pages
      }
    });
    pages.forEach((page, i) => {
      const elem = wrapper.find(listPagesId).children().at(i).children();
      expect(elem.prop('to')).equal('/pages/' + page.url);
    });

    wrapper.unmount();
  });
});
