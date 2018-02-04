const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {initialState, appPath, shallow, pages, admin} = require('../_shared.js');

const Page = require(appPath + 'components/Page').default.WrappedComponent;

describe('Testing Page Component.', () => {

  const props = {
    pageInfo: {
      pending: false,
      page: null
    },
    params: {
      pageUrl: 'page_url'
    },
    router: {
      params: {
        pageUrl: 'page_url'
      }
    },
    userData: null
  };

  const pageId = '[data-test-id="Page"]';
  const titleId = '[data-test-id="title"]';
  const textId = '[data-test-id="text"]';
  const linkEditId = '[data-test-id="link-to-edit"]';

  it('should correctly handle actions on the component', () => {
    const spyComponentWillMount = sinon.spy(Page.prototype, 'componentWillMount');

    const wrapper = shallow(<Page {...props} />);
    expect(spyComponentWillMount.calledOnce).equal(true);

    wrapper.unmount();
  });

  it('should show component correctly', () => {
    const wrapper = shallow(<Page {...props} />);

    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        pending: true
      }
    });
    expect(wrapper.find(pageId).exists()).equal(false);

    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        pending: false,
        page: null
      }
    });
    expect(wrapper.find(pageId).exists()).equal(false);

    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        pending: false,
        page: pages[0]
      }
    });
    expect(wrapper.find(pageId).exists()).equal(true);
    expect(wrapper.find(titleId).text()).equal(pages[0].title);

    const expectedTitle = 'expected title';
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        pending: false,
        page: {...pages[0],
          title: expectedTitle
        }
      }
    });
    expect(wrapper.find(titleId).text()).equal(expectedTitle);

    const expectedText = 'expected text';
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        pending: false,
        page: {...pages[0],
          text: expectedText
        }
      }
    });
    expect(wrapper.find(textId).prop('dangerouslySetInnerHTML')['__html']).equal(expectedText);

    expect(wrapper.find(linkEditId).exists()).equal(false);
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        page: pages[0]
      },
      userData: admin
    });
    expect(wrapper.find(linkEditId).exists()).equal(true);
    expect(wrapper.find(linkEditId).children().prop('to'))
      .equal('/pages/' + pages[0].url + '/edit');

    wrapper.unmount();
  });

  it('should retry request for new page', () => {

    const spyOnDispatch = sinon.spy();
    const _props = {
      dispatch: spyOnDispatch,
      pageInfo: {
        pending: false,
        page: {
          url: 'page_url',
          title: 'text',
          text: 'text'
        }
      },
      params: {
        pageUrl: 'page_url'
      },
      router: {
        params: {
          pageUrl: 'page_url'
        }
      }
    };
    const wrapper = shallow(<Page {..._props} />);

    let index = spyOnDispatch.callCount;
    expect(spyOnDispatch.calledOnce).equal(true);

    const newUrl = _props.router.params.pageUrl + 'new';
    wrapper.setProps({..._props,
      router: {
        params: {
          pageUrl: newUrl
        }
      }
    });
    wrapper.setProps({..._props,
      pageInfo: {..._props.pageInfo,
        page: {..._props.pageInfo.page,
          url: newUrl
        }
      },
      router: {
        params: {
          pageUrl: newUrl
        }
      }
    });
    // should request for new page
    expect(spyOnDispatch.callCount).equal(++index);

    // should not request for new page
    wrapper.setProps({..._props,
      pageInfo: {..._props.pageInfo,
        page: {..._props.pageInfo.page,
          url: newUrl
        }
      },
      router: {
        params: {
          pageUrl: newUrl
        }
      }
    });
    expect(spyOnDispatch.callCount).equal(index);

    // should not request for new page
    wrapper.setProps();
    expect(spyOnDispatch.callCount).equal(index);
  });
});
