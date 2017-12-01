const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {appPath, defaultLang, initialState, terms, languages, shallow, mountWithStore, newMountWithIntl} = require('../_shared.js');
const Edit = require(appPath + 'components/Edit').default.WrappedComponent;
const MountedEdit = require(appPath + 'components/Edit').default;

describe('Testing Edit Component.', () => {

  beforeEach(() => console.log = jest.fn());

  const term = terms[0];
  const termId = term.id;
  const translations = term.translations[0];
  const translatorId = translations.translatorId;
  const props = {
    editState: {
      started: true,
      termId,
      translatorId,
      source: translations,
      change: translations
    },
    query: {
      translatorId,
      termId
    },
    location: {
      query: {
        translatorId,
        termId
      }
    }
  };

  const blockMessageId = '[data-test-id="blockMessage"]';
  const errorId = '[data-test-id="request_error"]';
  const meaningsId = '[data-test-id="Meanings"]';
  const pendingId = '[data-test-id="pending"]';

  it('should show component correctly', () => {
    const onButtonClick = sinon.spy(Edit.prototype, '_goBack');
    const spy = sinon.spy(Edit.prototype, 'componentWillMount');
    const wrapper = shallow(<Edit {...props} dispatch={() => {}} />);

    const editId = '[data-test-id="Edit"]';
    expect(wrapper.find(editId).exists()).equal(true);
    expect(wrapper.find(blockMessageId).exists()).equal(false);
    expect(spy.calledOnce).to.equal(true);

    const backLinkId = '[data-test-id="back-link"]';
    wrapper.find(backLinkId).simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);

    wrapper.setProps({...props,
      editState: {...props.editState,
        pending: true
      }
    });
    expect(wrapper.find(pendingId).exists()).equal(true);
    expect(wrapper.find(errorId).exists()).equal(false);

    const errorMsgId = '[data-test-id="errorMsg"]';
    const errorMessage = 'Some error happened';
    wrapper.setProps({...props,
      editState: {...props.editState,
        error: {
          message: errorMessage
        }
      }
    });
    expect(wrapper.find(errorId).exists()).equal(true);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorMsgId).text()).equal(errorMessage);

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

  it('should contain component Meanings inside', () => {
    const _initialState = {...initialState,
      edit: {...initialState.edit,
        started: true,
        termId,
        translatorId,
        source: translations,
        change: translations
      }
    };

    const wrapper = mountWithStore(<MountedEdit {...props} />, _initialState);
    expect(wrapper.find(meaningsId).exists()).equal(true);
    wrapper.unmount();
  });

  it('should exists all i18n-texts for the component', () => {
    const arrIntlStringsId = [
      'Edit.should_select_term',
      'Edit.query_is_performed',
      'Edit.request_error',
      'Edit.go_back',
    ];

    languages.forEach(lang => {
      const i18n = require(appPath + 'i18n/' + lang.id);
      arrIntlStringsId.forEach(elem =>
        expect(i18n.hasOwnProperty(elem)).equal(true)
      );
    });
  });

  it('should show i18n-texts on the component', () => {
    // Can't change state on component with Intl and Store
  });
});
