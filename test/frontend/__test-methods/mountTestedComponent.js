const React = require('react');
const PropTypes = require('prop-types');
const {IntlProvider, intlShape} = require('react-intl');

const {mount, configure} = require('enzyme');
const _shallow = require('enzyme').shallow;
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });

const initialState = require('../../../app/reducers/_initial').default;
const i18n = require('../../../app/helpers/i18n').default;

const configureMockStore = require('redux-mock-store');
const thunk = require('redux-thunk').default;
let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

const getIntlContext = (lang, messages) => {
  messages = messages || i18n.data[lang];
  const intlProvider = new IntlProvider({ locale: lang, messages });
  const {intl} = intlProvider.getChildContext();
  return intl;
};

const nodeWithIntlProp = (node, lang = 'en') =>
  React.cloneElement({...node,
    props: {...node.props,
      dispatch: node.props.dispatch ? node.props.dispatch : () => true
    }
  }, {
    intl: getIntlContext(lang)
  });

const shallow = (node) => _shallow(
  React.cloneElement({...node,
    props: {...node.props,
      dispatch: node.props.dispatch ? node.props.dispatch : () => true
    }
  })
);

const mountWithIntl = (node, lang = 'en', state = initialState) =>
  mount(
    nodeWithIntlProp(node, lang),
    {
      context: {store: mockStore(state), intl: getIntlContext(lang)},
      childContextTypes: {store: PropTypes.object, intl: intlShape}
    }
  );

module.exports = {
  getIntlContext,
  mountWithIntl,
  shallow
};
