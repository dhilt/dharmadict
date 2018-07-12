const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  defaultTranslator,
  initialState,
  defaultUser,
  shallow,
  appPath,
  admin
} = require('../_shared.js');

const TranslatorPage = require(appPath + 'components/TranslatorPage').default.WrappedComponent;

describe('Testing TranslatorPage Component.', () => {

  const props = {
    translatorInfo: {...initialState.translatorInfo,
      data: defaultTranslator,
      pages: {...initialState.pagesInfo,
        data: ['page1', 'page2', 'page3']
      }
    },
    userInfo: {...initialState.auth.userInfo,
      data: defaultUser
    },
    common: {...initialState.common,
      userLanguage: defaultUser.language
    },
    params: {
      id: defaultTranslator.id
    },
    routeParams: {
      id: defaultTranslator.id
    }
  };

  const translatorId = '[data-test-id="changeTranslatorPassword"]';
  const pagesListId = '[data-test-id="listOfPages"]';
  const contentId = '[data-test-id="translatorContent"]';
  const adminId = '[data-test-id="changeUser"]';
  const pendingId = '[data-test-id="pending"]';
  const errorId = '[data-test-id="error"]';
  const descId = '[data-test-id="desc"]';
  const nameId = '[data-test-id="name"]';

  it('should show component correctly', () => {
    const spy = sinon.spy(TranslatorPage.prototype, 'componentWillMount');
    const wrapper = shallow(<TranslatorPage {...props} />);

    expect(spy.calledOnce).equal(true);

    const translatorPageId = '[data-test-id="TranslatorPage"]';
    expect(wrapper.find(translatorPageId).exists()).equal(true);

    wrapper.setProps({...props,
      translatorInfo: {...props.translatorInfo,
        pending: true
      }
    });
    expect(wrapper.find(pendingId).exists()).equal(true);
    expect(wrapper.find(pagesListId).exists()).equal(false);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(contentId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);

    wrapper.setProps({...props,
      translatorInfo: {...props.translatorInfo,
        error: 'Can\'t get translator data. Database error'
      }
    });
    expect(wrapper.find(errorId).exists()).equal(true);
    expect(wrapper.find(pagesListId).exists()).equal(false);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(contentId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(false);

    wrapper.setProps({...props,
      translatorInfo: {...props.translatorInfo,
        data: {...props.translatorInfo.data,
          description: null
        }
      }
    });
    expect(wrapper.find(descId).exists()).equal(false);
    expect(wrapper.find(pagesListId).exists()).equal(true);

    wrapper.setProps({...props,
      translatorInfo: {...props.translatorInfo,
        pages: {...props.translatorInfo.pages,
          data: []
        }
      }
    });
    expect(wrapper.find(pagesListId).exists()).equal(false);

    wrapper.setProps(props);
    expect(wrapper.find(contentId).exists()).equal(true);
    expect(wrapper.find(pagesListId).exists()).equal(true);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(false);
    expect(wrapper.find(descId).exists()).equal(true);
    expect(wrapper.find(nameId).text()).equal(defaultTranslator.name);

    wrapper.setProps({...props,
      userInfo: {
        data: defaultTranslator
      }
    });
    const refForTranslator = '/translator/' + defaultTranslator.id + '/password';
    expect(wrapper.find(translatorId).prop('to')).equal(refForTranslator);
    expect(wrapper.find(translatorId).exists()).equal(true);
    expect(wrapper.find(adminId).exists()).equal(false);

    wrapper.setProps({...props,
      userInfo: {
        data: admin
      }
    });
    const refForAdmin = '/translator/' + defaultTranslator.id + '/edit';
    expect(wrapper.find(adminId).prop('to')).equal(refForAdmin);
    expect(wrapper.find(translatorId).exists()).equal(false);
    expect(wrapper.find(adminId).exists()).equal(true);

    wrapper.unmount();
  });
});
