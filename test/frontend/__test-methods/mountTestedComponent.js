const React = require('react');
const {IntlProvider, intlShape} = require('react-intl');
const {mount, shallow, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
const {Provider} = require('react-redux');
const {expect} = require('chai');
configure({ adapter: new Adapter() });

const initialState = require('../../../app/reducers/_initial').default;
const i18n = require('../../../app/helpers/i18n').default;

const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

const getIntlContext = (lang) => {
  const messages = i18n.data[lang];
  const intlProvider = new IntlProvider({ locale: lang, messages });
  const {intl} = intlProvider.getChildContext();
  return intl;
};

const nodeWithIntlProp = (node, lang = 'en') =>
  React.cloneElement(node, { intl: getIntlContext(lang) });

const shallowWithIntl = (node, lang = 'en', {context} = {}) => {
  return shallow(
    nodeWithIntlProp(node, lang),
    {
      context: Object.assign({}, context, { intl: getIntlContext(lang) })
    }
  );
};

const mountWithIntl = (node, lang = 'en', {context, childContextTypes} = {}, state = initialState) => {
  return mount(
    <Provider store={mockStore(state)}>
      {nodeWithIntlProp(node, lang)}
    </Provider>,
    {
      context: Object.assign({}, context, { intl: getIntlContext(lang) }),
      childContextTypes: Object.assign({}, {intl: intlShape}, childContextTypes)
    }
  );
};

module.exports = {
  shallowWithIntl,
  mountWithIntl
};


// Delete all code below

const ConnectedIntlProvider = require('../../../app/ConnectedIntlProvider').default;
const langHelper = require('../../../app/helpers/lang').default;

const setupComponent = (NewComponent, state = initialState, props = {}) => {

  langHelper.setUserLanguage(state.common.userLanguage || langHelper.defaultLang);
  const store = mockStore(state);

  const wrapper = mount(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <NewComponent {...props} />
      </ConnectedIntlProvider>
    </Provider>
  );
  return {wrapper, store, props}
};

const checkWrap = (wrap, params) => {
  if (!params) {
    expect(wrap.length).equal(1)
    return
  }
  if (params.className) {
    expect(wrap.hasClass(params.className)).equal(true)
  }
  if (params.length || params.length === 0) {
    expect(wrap.length).equal(params.length)
  } else {
    expect(wrap.length).equal(1)
  }
  if (params.text) {
    expect(wrap.text()).equal(params.text)
  }
  if (params.disabled) {
    expect(wrap.props().disabled).equal(params.disabled)
  }
  if (params.type) {
    expect(wrap.props().type).equal(params.type)
  }
  if (params.name) {
    expect(wrap.props().name).equal(params.name)
  }
  if (params.value) {
    expect(wrap.props().value).equal(params.value)
  }
  if (params.checked) {
    expect(wrap.props().checked).equal(params.checked)
  }
  if (params.placeholder) {
    expect(wrap.props().placeholder).equal(params.placeholder)
  }
  if (params.contentLabel) {
    expect(wrap.props().contentLabel).equal(params.contentLabel)
  }
  if (params.isOpen) {
    expect(wrap.props().isOpen).equal(params.isOpen)
  }
  return
};

const checkWrapActions = (store, amount) => {
  expect(store.getActions().length).equal(amount);
  return
};

module.exports = Object.assign(module.exports, {
  setupComponent,
  checkWrap,
  checkWrapActions
});
