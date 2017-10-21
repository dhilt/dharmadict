const expect = require('expect');

const lang = require('../../app/helpers/lang').default;

const i18nFiles = {};
lang.list.forEach(elem => i18nFiles[elem] = require('../../app/i18n/' + elem));

describe('test i18n translations', () => {

  it('should contain the same amount of translations', () => {
    const amount = Object.keys(i18nFiles[lang.defaultLang]).length;
    lang.list.forEach(elem => {
      expect(Object.keys(i18nFiles[elem]).length).toEqual(amount);
    });
  });

  describe('check each language separately', () => {
    lang.list.forEach(language => {
      if (language === lang.defaultLang) {
        return
      } else {
        it(`${language}-translations should contain all translation-keys like in default i18n-file`, () => {
          const defaultI18nArr = Object.keys(i18nFiles[lang.defaultLang]);
          const checkedI18nArr = Object.keys(i18nFiles[language]);
          checkedI18nArr.forEach(elem =>
            expect(defaultI18nArr.find(e => e === elem)).toEqual(elem)
          )
        })
      }
    })
  });
})
