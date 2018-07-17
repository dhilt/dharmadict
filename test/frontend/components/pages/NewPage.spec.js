const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  initialState,
  getAppPath,
  shallow
} = require('../../_shared.js');

const NewPage = require(getAppPath(2) + 'components/pages/NewPage').default.WrappedComponent;

describe('Testing NewPage Component.', () => {

  const props = {
    pageInfo: initialState.admin.newPage
  };

  const newPageId = '[data-test-id="NewPage"]';
  const inputUrlId = '[data-test-id="input-url"]';
  const inputTitleId = '[data-test-id="input-title"]';
  const inputTextId = '[data-test-id="input-text"]';
  const inputBioId = '[data-test-id="input-bio"]';
  const btnSaveId = '[data-test-id="btn-save"]';
  const linkCancelId = '[data-test-id="link-cancel"]';

  it('should correctly handle actions on the component', () => {
    const spySendNewPageData = sinon.spy(NewPage.prototype, 'sendNewPageData');
    const spyChangePageTitle = sinon.spy(NewPage.prototype, 'changePageTitle');
    const spyChangePageText = sinon.spy(NewPage.prototype, 'changePageText');
    const spyChangePageUrl = sinon.spy(NewPage.prototype, 'changePageUrl');
    const spyChangePageBio = sinon.spy(NewPage.prototype, 'changePageBio');

    const defaultEvent = {
      preventDefault: () => null,
      target: {
        value: 'password'
      }
    };
    const wrapper = shallow(<NewPage {...props} />);

    wrapper.find(inputTitleId).simulate('change', defaultEvent);
    wrapper.find(inputTextId).simulate('change', defaultEvent);
    wrapper.find(inputUrlId).simulate('change', defaultEvent);
    wrapper.find(inputBioId).simulate('change', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    expect(spySendNewPageData.calledOnce).equal(true);
    expect(spyChangePageTitle.calledOnce).equal(true);
    expect(spyChangePageText.calledOnce).equal(true);
    expect(spyChangePageUrl.calledOnce).equal(true);
    expect(spyChangePageBio.calledOnce).equal(true);

    wrapper.unmount();
  });

  it('should show component correctly', () => {
    const wrapper = shallow(<NewPage {...props} />);

    expect(wrapper.find(newPageId).exists()).equal(true);

    const editedUrl = props.pageInfo.data.url + ' new';
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        data: {...props.pageInfo.data,
          url: editedUrl
        }
      }
    });
    expect(wrapper.find(inputUrlId).prop('value')).equal(editedUrl);

    const editedText = props.pageInfo.data.text + ' new';
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        data: {...props.pageInfo.data,
          text: editedText
        }
      }
    });
    expect(wrapper.find(inputTextId).prop('value')).equal(editedText);

    const editedTitle = props.pageInfo.data.title + ' new';
    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        data: {...props.pageInfo.data,
          title: editedTitle
        }
      }
    });
    expect(wrapper.find(inputTitleId).prop('value')).equal(editedTitle);

    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        data: {...props.pageInfo.data,
          bio: true
        }
      }
    });
    expect(wrapper.find(inputBioId).prop('checked')).equal(true);

    wrapper.unmount();
  });

  it('should disable save button on the component', () => {
    const wrapper = shallow(<NewPage {...props} />);

    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.setProps({...props,
      pageInfo: {...props.pageInfo,
        pending: false
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(false);

    wrapper.unmount();
  });
});
