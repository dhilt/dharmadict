const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  mountWithIntl,
  initialState,
  defaultLang,
  defaultTerm,
  languages,
  shallow,
  appPath
} = require('../_shared.js');

const Edit = require(appPath + 'components/Edit').default.WrappedComponent;

describe('Testing Edit Component.', () => {

  beforeEach(() => console.log = jest.fn());

  const translations = defaultTerm.translations[0];
  const translatorId = translations.translatorId;
  const termId = defaultTerm.id;
  const props = {
    editState: {
      source: translations,
      change: translations,
      started: true,
      translatorId,
      termId,
    },
    query: {
      translatorId,
      termId
    }
  };

  const blockMessageId = '[data-test-id="blockMessage"]';
  const errorId = '[data-test-id="request_error"]';
  const backLinkId = '[data-test-id="back-link"]';
  const meaningsId = '[data-test-id="Meanings"]';
  const errorMsgId = '[data-test-id="errorMsg"]';
  const pendingId = '[data-test-id="pending"]';
  const editId = '[data-test-id="Edit"]';

  it('should show component correctly', () => {
    const onButtonClick = sinon.spy(Edit.prototype, 'goBack');
    const spyCompWillMount = sinon.spy(Edit.prototype, 'componentWillMount');
    const wrapper = shallow(<Edit {...props} />);

    expect(spyCompWillMount.calledOnce).equal(true);

    expect(wrapper.find(editId).exists()).equal(true);
    expect(wrapper.find(blockMessageId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);

    wrapper.find(backLinkId).simulate('click');
    expect(onButtonClick.calledOnce).equal(true);

    wrapper.setProps({...props,
      editState: {...props.editState,
        pending: true
      }
    });
    expect(wrapper.find(pendingId).exists()).equal(true);
    expect(wrapper.find(blockMessageId).exists()).equal(false);
    expect(wrapper.find(meaningsId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);

    const errorMessage = 'Some error happened';
    wrapper.setProps({...props,
      editState: {...props.editState,
        error: {
          message: errorMessage
        }
      }
    });
    expect(wrapper.find(errorId).exists()).equal(true);
    expect(wrapper.find(errorMsgId).text()).equal(errorMessage);
    expect(wrapper.find(blockMessageId).exists()).equal(false);
    expect(wrapper.find(meaningsId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);

    wrapper.unmount();
  });

  it('should show blockMessage on component (no termId and/or no translatorId)',
    () => [
      Object.assign({}, props, {query: {translatorId, termId: ''}}),
      Object.assign({}, props, {query: {translatorId: '', termId}}),
      Object.assign({}, props, {query: {translatorId: '', termId: ''}})
    ].forEach(props => {
      const wrapper = shallow(<Edit {...props} />);
      expect(wrapper.find(blockMessageId).exists()).equal(true);
      expect(wrapper.find(meaningsId).exists()).equal(false);
      expect(wrapper.find(pendingId).exists()).equal(false);
      expect(wrapper.find(errorId).exists()).equal(false);
      wrapper.unmount();
    })
  );

  const _initialState = {...initialState,
    edit: Object.assign({}, initialState.edit, props.editState)
  };

  it('should contain component Meanings inside', () => {
    const wrapper = mountWithIntl(<Edit {...props} />, defaultLang, _initialState);
    expect(wrapper.find(meaningsId).exists()).equal(true);
    wrapper.unmount();
  });

  const arrIntlStringsId = [
    [blockMessageId, 'Edit.should_select_term'],
    [pendingId, 'Edit.query_is_performed'],
    [errorId, 'Edit.request_error'],
    [backLinkId, 'Edit.go_back']
  ];

  languages.forEach(lang => {
    const i18n = require(appPath + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component ${lang.id}`, () =>
      arrIntlStringsId.forEach(elem =>
        expect(i18n.hasOwnProperty(elem[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component ${lang.id}`, () => {
      const _props = {...props,
        common: {...initialState.common,
          userLanguage: lang.id,
          languages
        }
      };
      const wrapper = mountWithIntl(<Edit {..._props} />, lang.id, _initialState);

      const backLinkId = arrIntlStringsId[3];
      expect(wrapper.find(backLinkId[0]).first().text()).equal(i18n[backLinkId[1]]);

      const blockMessageId = arrIntlStringsId[0];
      wrapper.setProps({...props,
        query: {
          translatorId: null,
          termId: null
        }
      });
      wrapper.unmount().mount();  // Calling 'componentWillMount'
      expect(wrapper.find(blockMessageId[0]).text()).equal(i18n[blockMessageId[1]]);

      const errorId = arrIntlStringsId[2];
      const errMsg = 'error message';
      wrapper.setProps({...props,
        editState: {...props.editState,
          error: {
            message: errMsg
          }
        }
      });
      expect(wrapper.find(errorId[0]).text()).equal(i18n[errorId[1]] + errMsg);

      const pendingId = arrIntlStringsId[1];
      wrapper.setProps({...props,
        editState: {...props.editState,
          pending: true
        }
      });
      expect(wrapper.find(pendingId[0]).first().text()).equal(i18n[pendingId[1]]);
    });
  });
});
