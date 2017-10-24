global.window.localStorage = {};
// localStorage['dharmadictToken'] = 'token?';

const initialState = require('../../app/reducers/_initial').default;
const auth = require('../../app/helpers/auth').default;
const lang = require('../../app/helpers/lang').default;
const notifier = require('../../app/helpers/notifier').default;

const React = require('react');
const {Component} = require('react');
const {Provider} = require('react-redux');
const {IntlProvider, addLocaleData} = require('react-intl');
const {shallow, mount, render, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });

const _defaultLang = require('react-intl/locale-data/' + lang.defaultLang);
addLocaleData([..._defaultLang]);
const i18n = require('../../app/helpers/i18n').default;

const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

const getNotificationAction = (successMessage, error, values = {}) => {
  const store = mockStore(initialState);
  store.dispatch(notifier.onResponse(successMessage, error, values));
  return store.getActions()[0]
};

const setupComponent = (NewComponent, state = initialState, props = {}) => {
  const wrapper = mount(
    <Provider store={mockStore(state)}>
      <IntlProvider locale={lang.defaultLang} messages={i18n.data[lang.defaultLang]}>
        <NewComponent {...props} />
      </IntlProvider>
    </Provider>
  );
  return wrapper
};

const translators = [{
  id: 'ZAG',
  name: 'Б.И. Загуменнов',
  role: 'translator',
  description: 'desc',
  language: 'ru'
}, {
  id: 'AKT',
  name: 'А. Кугявичус - А.А. Терентьев',
  role: 'translator',
  description: '',
  language: 'ru'
}, {
  id: 'MM',
  name: 'М. Малыгина',
  role: 'translator',
  description: '',
  language: 'ru'
}, {
  id: 'HOP',
  name: 'J. Hopkins',
  role: 'translator',
  description: '',
  language: 'en'
}, {
  id: 'BRZ',
  name: 'A. Berzin',
  role: 'translator',
  description: '',
  language: 'en'
}, {
  id: 'DON',
  name: 'А.М. Донец',
  role: 'translator',
  description: '',
  language: 'ru'
}, {
  id: 'MK',
  name: 'М.Н. Кожевникова',
  role: 'translator',
  description: '',
  language: 'en'
}];

const languages = [{
  id: 'ru',
  name: 'русский',
  name_ru: 'русский',
  name_en: 'russian',
}, {
  id: 'en',
  name: 'english',
  name_ru: 'английский',
  name_en: 'english'
}];

const users = [

];

const terms = [{
  "id": "chos",
  "wylie" : "chos",
  "sanskrit_ru" : "дхамма, дхарма",
  "sanskrit_ru_lower" : "дхамма, дхарма",
  "sanskrit_en" : "Dharma",
  "sanskrit_en_lower" : "dharma",
  "translations" : [
    {
      "translatorId" : "MK",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "Дхарма",
            "Учение",
            "духовное учение",
            "духовность"
          ],
          "comment" : "",
          "versions_lower" : [
            "дхарма",
            "учение",
            "духовное учение",
            "духовность"
          ]
        },
        {
          "versions" : [
            "дхарма",
            "элементы бытия",
            "феномены",
            "явления"
          ],
          "comment" : "",
          "versions_lower" : [
            "дхарма",
            "элементы бытия",
            "феномены",
            "явления"
          ]
        }
      ]
    },
    {
      "translatorId" : "AKT",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "Учение",
            "Дхарма"
          ],
          "comment" : "",
          "versions_lower" : [
            "учение",
            "дхарма"
          ]
        },
        {
          "versions" : [
            "элемент",
            "дхарма",
            "явление"
          ],
          "comment" : "",
          "versions_lower" : [
            "элемент",
            "дхарма",
            "явление"
          ]
        }
      ]
    },
    {
      "translatorId" : "ZAG",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "Учение Будды",
            "буддизм"
          ],
          "comment" : "",
          "versions_lower" : [
            "учение будды",
            "буддизм"
          ]
        },
        {
          "versions" : [
            "явления"
          ],
          "comment" : "",
          "versions_lower" : [
            "явления"
          ]
        },
        {
          "versions" : [
            "элементы бытия"
          ],
          "comment" : "",
          "versions_lower" : [
            "элементы бытия"
          ]
        },
        {
          "versions" : [
            "психические свойства"
          ],
          "comment" : "",
          "versions_lower" : [
            "психические свойства"
          ]
        }
      ]
    },
    {
      "translatorId" : "DON",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "Учение",
            "элемент",
            "закон",
            "справедливость",
            "предмет мысли",
            "качество"
          ],
          "comment" : "",
          "versions_lower" : [
            "учение",
            "элемент",
            "закон",
            "справедливость",
            "предмет мысли",
            "качество"
          ]
        }
      ]
    },
    {
      "translatorId" : "HOP",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "doctrine",
            "religion",
            "practice",
            "way"
          ],
          "comment" : "",
          "versions_lower" : [
            "doctrine",
            "religion",
            "practice",
            "way"
          ]
        },
        {
          "versions" : [
            "phenomenon",
            "phenomena",
            "topic"
          ],
          "comment" : "",
          "versions_lower" : [
            "phenomenon",
            "phenomena",
            "topic"
          ]
        },
        {
          "versions" : [
            "quality",
            "attribute"
          ],
          "comment" : "",
          "versions_lower" : [
            "quality",
            "attribute"
          ]
        }
      ]
    },
    {
      "translatorId" : "BRZ",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "dharma"
          ],
          "comment" : "(1) Preventive measures which, if one puts into practice or achieves, prevent the experience of future suffering. (2) Buddha's teachings. (3) Any phenomenon or \"thing.\"",
          "versions_lower" : [
            "dharma"
          ]
        },
        {
          "versions" : [
            "phenomenon"
          ],
          "comment" : "A validly knowable object that holds its own individual self-nature.",
          "versions_lower" : [
            "phenomenon"
          ]
        }
      ]
    },
    {
      "translatorId" : "MM",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "Дхарма",
            "Учение Будды",
            "феномен",
            "религия"
          ],
          "comment" : "",
          "versions_lower" : [
            "дхарма",
            "учение будды",
            "феномен",
            "религия"
          ]
        }
      ]
    }
  ]
}, {
  "id": "chos_[kyi]_dbyings",
  "wylie" : "chos [kyi] dbyings",
  "sanskrit_ru" : "дхармадхату",
  "sanskrit_ru_lower" : "дхармадхату",
  "sanskrit_en" : "dharmadhatu",
  "sanskrit_en_lower" : "dharmadhatu",
  "translations" : [
    {
      "translatorId" : "AKT",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "дхармадхату"
          ],
          "comment" : "",
          "versions_lower" : [
            "дхармадхату"
          ]
        }
      ]
    },
    {
      "translatorId" : "ZAG",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "Высшая Реальность"
          ],
          "comment" : "",
          "versions_lower" : [
            "высшая реальность"
          ]
        }
      ]
    },
    {
      "translatorId" : "HOP",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "sphere of reality",
            "noumenal expanse",
            "nature of phenomena"
          ],
          "comment" : "An equivalent of ultimate truth so called because meditation within observing it acts as a cause of the qualities of Superiors. Emptiness, being uncaused, is not itself a cause (element), but meditation on it causes the development of marvelous qualities; thus, emptiness comes to be called a cause, an element producing those qualities.",
          "versions_lower" : [
            "sphere of reality",
            "noumenal expanse",
            "nature of phenomena"
          ]
        },
        {
          "versions" : [
            "element of [a Superior's] qualities",
            "basic element of phenomena"
          ],
          "comment" : "",
          "versions_lower" : [
            "element of [a superior's] qualities",
            "basic element of phenomena"
          ]
        }
      ]
    },
    {
      "translatorId" : "MM",
      "language" : "ru",
      "meanings" : [
        {
          "versions" : [
            "пространство реальности",
            "природа явлений"
          ],
          "comment" : "",
          "versions_lower" : [
            "пространство реальности",
            "природа явлений"
          ]
        }
      ]
    }
  ]
}];

const translations = [

];

const cloneState = (state = initialState) => JSON.parse(JSON.stringify(state));

module.exports = {
  defaultLang: lang.defaultLang,
  initialState,
  cloneState,
  setupComponent,
  getNotificationAction,
  translators,
  languages,
  users,
  terms,
  translations
}
