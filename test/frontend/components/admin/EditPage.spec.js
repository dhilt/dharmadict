const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  initialState,
  getAppPath,
  shallow
} = require('../../_shared.js');

const EditPage = require(getAppPath(2) + 'components/admin/EditPage').default.WrappedComponent;

describe('Testing NewPage Component.', () => {

  const props = {
    pageInfo: initialState.admin.editPage,
    params: {
      pageUrl: 'page_url'
    }
  };

  const editPageId = '[data-test-id="EditPage"]';
  const inputTitleId = '[data-test-id="input-title"]';
  const inputTextId = '[data-test-id="input-text"]';
  const btnSaveId = '[data-test-id="btn-save"]';
  const btnResetId = '[data-test-id="btn-reset"]';
  const btnDeleteId = '[data-test-id="btn-delete"]';
  const linkCancelId = '[data-test-id="link-cancel"]';

  it('should correctly handle actions on the component', () => {
    const spyComponentWillMount = sinon.spy(EditPage.prototype, 'componentWillMount');
    const spySendNewPageData = sinon.spy(EditPage.prototype, 'sendNewPageData');
    const spyChangePageTitle = sinon.spy(EditPage.prototype, 'changePageTitle');
    const spyChangePageText = sinon.spy(EditPage.prototype, 'changePageText');
    const spyResetChanges = sinon.spy(EditPage.prototype, 'resetChanges');
    const spyDeletePage = sinon.spy(EditPage.prototype, 'deletePage');

    const defaultEvent = {
      preventDefault: () => null,
      target: {
        value: 'password'
      }
    };
    const wrapper = shallow(<EditPage {...props} />);

    wrapper.find(inputTitleId).simulate('change', defaultEvent);
    wrapper.find(inputTextId).simulate('change', defaultEvent);
    wrapper.find(btnDeleteId).simulate('click', defaultEvent);
    wrapper.find(btnResetId).simulate('click', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    expect(spyComponentWillMount.calledOnce).equal(true);
    expect(spySendNewPageData.calledOnce).equal(true);
    expect(spyChangePageTitle.calledOnce).equal(true);
    expect(spyChangePageText.calledOnce).equal(true);
    expect(spyResetChanges.calledOnce).equal(true);
    expect(spyDeletePage.calledOnce).equal(true);

    wrapper.unmount();
  });

  it('should show component correctly', () => {
    const wrapper = shallow(<EditPage {...props} />);

    expect(wrapper.find(editPageId).exists()).equal(true);

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

    const expectedUrl = '/pages/' + props.params.pageUrl;
    expect(wrapper.find(linkCancelId).prop('to')).equal(expectedUrl);

    wrapper.unmount();
  });

  it('should disable save button on the component', () => {
    const wrapper = shallow(<EditPage {...props} />);

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
