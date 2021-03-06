const React = require('react');
const {expect} = require('chai');

const {getAppPath, shallow, pages, defaultTranslator, admin} = require('../../_shared.js');

const Page = require(getAppPath(2) + 'components/pages/Page').default.WrappedComponent;

describe('Testing Page Component.', () => {

  const props = {
    pageInfo: {
      pending: false,
      page: null
    },
    userData: null
  };

  const pageId = '[data-test-id="Page"]';
  const titleId = '[data-test-id="title"]';
  const textId = '[data-test-id="text"]';
  const linkEditId = '[data-test-id="link-to-edit"]';

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

    const equalId = 'equal-id';
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        page: {
          ...pages[0],
          author: equalId
        }
      },
      userData: {
        ...defaultTranslator,
        id: equalId
      }
    });
    expect(wrapper.find(linkEditId).exists()).equal(true);
    expect(wrapper.find(linkEditId).children().prop('to'))
      .equal('/pages/' + pages[0].url + '/edit');

    const anotherId = 'another-id';
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        page: {
          ...pages[0],
          author: equalId
        }
      },
      userData: {
        ...defaultTranslator,
        id: anotherId
      }
    });
    expect(wrapper.find(linkEditId).exists()).equal(false);

    wrapper.unmount();
  });
});
