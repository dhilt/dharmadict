const fs = require('fs');
const path = require('path');
const React = require('react');
const {expect} = require('chai');

const {appPath, mountWithIntl, defaultTerm} = require('../_shared.js');
const Term = require(appPath + 'components/search/Term').default.WrappedComponent;
const Home = require(appPath + 'components/Home').default;
const lang = require(appPath + 'helpers/lang').default;

const i18nFiles = {};
lang.list.forEach(elem => i18nFiles[elem] = require(appPath + 'i18n/' + elem));

describe('test i18n translations', () => {

  it('should contain the same amount of translations', () => {
    const amount = Object.keys(i18nFiles[lang.defaultLang]).length;
    lang.list.forEach(elem =>
      expect(Object.keys(i18nFiles[elem]).length).equal(amount)
    );
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
            expect(defaultI18nArr.find(e => e === elem)).equal(elem)
          )
        })
      }
    })
  });

  it('should correctly show simple i18n-string on component', () =>
    lang.list.forEach(langId => {
      const wrapper = mountWithIntl(<Home />, langId);
      const i18nStringExpected = i18nFiles[langId]['Home.search_title_h1'];
      const i18nStringResult = wrapper.find('[data-test-id="span-title"]').text();
      expect(i18nStringResult).equal(i18nStringExpected);
      wrapper.unmount();
    })
  );

  it('should correctly show i18n-string with values on component', () =>
    lang.list.forEach(langId => {
      const props = {
        data: {
          term: defaultTerm
        },
        lang: langId
      };
      const wrapper = mountWithIntl(<Term {...props} />, langId);
      expect(wrapper.find('[data-test-id="sanskrit"]').text()).equal(
        i18nFiles[langId]['Term.sanskrit_term'].replace(
          `{sanskrit_${langId}}`,
          defaultTerm['sanskrit_' + langId]
        )
      );
      wrapper.unmount();
    })
  );

  describe('check each component on existings i18n-strings', () => {

    const componentsPath = path.join(__dirname, appPath, 'components');

    const getFiles = (dir, _files) => {
      _files = _files || [];
      let files = fs.readdirSync(dir);
      for (let i in files) {
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
          getFiles(name, _files);
        } else {
          _files.push(name);
        }
      }
      return _files;
    };

    const getFormattedMessagesFromFile = (file) => {
      const testedComponent = fs.readFileSync(file, 'utf8');
      const regexp = /<FormattedMessage[A-Za-z0-9_.,="'\s {}()?+:\[\]]*[/][>]/gi;
      return testedComponent.match(regexp) || [];
    };

    const getArrIntlId = (arr) => {
      let result = [];
      const validRegexp = /id="[A-Za-z0-9_.]*"/gi;
      const invalidRegexp = /id={[A-Za-z0-9_.]*}/gi;
      arr.forEach(message => {
        if (message.match(invalidRegexp) !== null) {
          // strings like this doesn't have intl-id: <FormattedMessage id={elem.text} />
          return
        } else {
          let _result = message.match(validRegexp)[0];
          result.push(_result.replace(/id="/, '').replace(/"/, ''));
        }
      });
      return result || [];
    };

    const getAllId = () => {
      let result = [];
      const components = getFiles(componentsPath);
      components.forEach(filename => {
        const arrFormattedMessages = getFormattedMessagesFromFile(filename);
        const arrIntlId = getArrIntlId(arrFormattedMessages);
        result = result.concat(arrIntlId);
      });
      return result;
    };

    const testedArrId = getAllId();

    lang.list.forEach(langId =>
      it(`should find all intl-id in i18n-files on lang: ${langId}`, () => {
        const i18nFile = require(appPath + 'i18n/' + langId);
        testedArrId.forEach(testedId =>
          expect(i18nFile.hasOwnProperty(testedId)).equal(true)
        );
      })
    );
  });
});
