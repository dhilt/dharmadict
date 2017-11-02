const React = require('react');
const {Provider} = require('react-redux');
const {IntlProvider, addLocaleData} = require('react-intl');
const {expect} = require('chai');
const {mount, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });

const initialState = require('../../../app/reducers/_initial').default;
const lang = require('../../../app/helpers/lang').default;

const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

const setupComponent = (NewComponent, state = initialState, props = {}) => {

  const i18n = require('../../../app/helpers/i18n').default;
  const _lang = state.common.userLanguage || lang.defaultLang;
  const i18nLang = require('react-intl/locale-data/' + _lang);
  addLocaleData([...i18nLang]);

  const wrapper = mount(
    <Provider store={mockStore(state)}>
      <IntlProvider locale={_lang} messages={i18n.data[_lang]}>
        <NewComponent {...props} />
      </IntlProvider>
    </Provider>
  );
  return wrapper
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
  return
};

module.exports = {
  setupComponent,
  checkWrap
};
