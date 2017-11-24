const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');
const {shallow, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });

const {appPath, setupComponent, initialState, terms, languages} = require('../_shared.js');
const ConnectedEdit = require(appPath + 'components/Edit').default;
const Edit = require(appPath + 'components/Edit').default.WrappedComponent;

describe('Testing Edit Component.', () => {

  beforeEach(() => console.log = jest.fn());

  let arrIntlStringsId = [];

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

    expect(wrapper.find('[data-test-id="Edit"]').exists()).equal(true);
    expect(wrapper.find('[data-test-id="blockMessage"]').exists()).equal(false);
    expect(spy.calledOnce).to.equal(true);

    const backLinkId = '[data-test-id="back-link"]';
    wrapper.find(backLinkId).simulate('click');
    expect(onButtonClick).to.have.property('callCount', 1);
    arrIntlStringsId.push(wrapper.find(backLinkId).children().props().id);

    wrapper.setProps({...props,
      editState: {...props.editState,
        pending: true
      }
    });
    expect(wrapper.find(pendingId).exists()).equal(true);
    expect(wrapper.find(errorId).exists()).equal(false);
    arrIntlStringsId.push(wrapper.find(pendingId).children().props().id);

    const errorMsgId = '[data-test-id="errorMsg"]';
    const errorMessage = 'Some error happened';
    wrapper.setProps({...props,
      editState: {...props.editState,
        error: {
          message: errorMessage
        }
      }
    });
    arrIntlStringsId.push(wrapper.find(errorId).children().first().props().id);
    expect(wrapper.find(errorId).exists()).equal(true);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorMsgId).text()).equal(errorMessage);

    wrapper.unmount();
  });

  it('should show blockMessage on component (no termId and no translatorId)', () => {
    const propsWithoutTranslatorId = Object.assign({}, props, {query: {translatorId, termId: ''}});
    const propsWithoutTermId = Object.assign({}, props, {query: {translatorId, termId: ''}});
    const propsWithoutAll = Object.assign({}, props, {query: {translatorId: '', termId: ''}});

    let wrapper = shallow(<Edit {...propsWithoutTranslatorId} />);
    expect(wrapper.find(blockMessageId).exists()).equal(true);
    expect(wrapper.find(meaningsId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);
    wrapper.unmount();

    wrapper = shallow(<Edit {...propsWithoutTermId} />);
    expect(wrapper.find(blockMessageId).exists()).equal(true);
    expect(wrapper.find(meaningsId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);
    wrapper.unmount();

    wrapper = shallow(<Edit {...propsWithoutAll} />);
    expect(wrapper.find(blockMessageId).exists()).equal(true);
    expect(wrapper.find(meaningsId).exists()).equal(false);
    expect(wrapper.find(pendingId).exists()).equal(false);
    expect(wrapper.find(errorId).exists()).equal(false);
    wrapper.unmount();
  });

  it('should contain component Meanings inside', () => {
    const _initialState = { ...initialState,
      edit: { ...initialState.edit,
        started: true,
        termId,
        translatorId,
        source: translations,
        change: translations
      }
    };

    const {wrapper} = setupComponent(ConnectedEdit, _initialState, props);
    expect(wrapper.find(meaningsId).exists()).equal(true);
    wrapper.unmount();
  });

  it('should not contain component Meanings inside', () => {
    const _initialState = { ...initialState,
      edit: { ...initialState.edit,
        started: true,
        termId,
        translatorId,
        source: translations,
        change: translations
      }
    };
    const _props = {...props,
      location: {...props.location,
        query: {...props.location.query,
          termId: ''
        }
      }
    };

    const {wrapper} = setupComponent(ConnectedEdit, _initialState, _props);
    expect(wrapper.find(meaningsId).exists()).equal(false);

    const blockMessageId = '[data-test-id="blockMessage"]';
    arrIntlStringsId.push(wrapper.find(blockMessageId).children().props().id);

    wrapper.unmount();
  });

  it('should exists all i18n-texts for the component', () => {
    languages.forEach(lang => {
      const i18n = require(appPath + 'i18n/' + lang.id);
      arrIntlStringsId.forEach(elem => expect(i18n.hasOwnProperty(elem)).equal(true));
    });
  });
});
