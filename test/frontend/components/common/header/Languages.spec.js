const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  mountWithIntl,
  defaultLang,
  getAppPath,
  languages,
  shallow
} = require('../../../_shared.js');

const Languages = require(getAppPath(3) + 'components/common/header/Languages').default;

describe('Testing Languages Component.', () => {

  const defaultEvent = {
    preventDefault: () => true
  };
  const props = {
    doChangeLang: sinon.spy(),
    current: defaultLang,
    languages
  };

  const LanguagesMenuItemId = '[data-test-id="Languages.MenuItem"]';

  it('should correctly handle actions', () => {
    const wrapper = shallow(<Languages {...props} />);

    languages.forEach((lang, i) => {
      wrapper.find(LanguagesMenuItemId).at(i).simulate('select', defaultEvent);
    });

    expect(props.doChangeLang.callCount).equal(languages.length);

    wrapper.unmount();
  });

  const LanguagesId = '[data-test-id="Languages"]';
  const dropdownBtnId = '[data-test-id="Languages.Dropdown"]';
  const showLangId = '[data-test-id="Languages.showLangId"]';
  const langItemId = '[data-test-id="Languages.langItem"]';
  const titleId = '[data-test-id="Languages.title"]';

  it('should show component correctly', () => {
    const wrapper = mountWithIntl(<Languages {...props} />);

    expect(wrapper.find(LanguagesId).exists()).equal(true);
    expect(wrapper.find(dropdownBtnId).exists()).equal(true);

    languages.forEach((lang, i) => {
      wrapper.setProps({...props,
        current: lang.id
      });

      expect(wrapper.find(titleId).exists()).equal(true);
      const expectedTitleText = languages.reduce((init, elem, index) =>
        init += elem.id + (index < languages.length - 1 ? '/' : ''), ''
      );
      expect(wrapper.find(titleId).text()).equal(expectedTitleText);

      expect(wrapper.find(langItemId).at(i).exists()).equal(true);
      const expectedLangItemText = lang.id + (i < languages.length - 1 ? '/' : '');
      expect(wrapper.find(langItemId).at(i).text()).equal(expectedLangItemText);

      languages.forEach((_lang, _i) => {
        expect(wrapper.find(langItemId).at(_i).find(showLangId).exists()).equal(true);
        expect(wrapper.find(langItemId).at(_i).find(showLangId).text()).equal(_lang.id);
        expect(wrapper.find(langItemId).at(_i).find(showLangId).prop('className'))
          .equal(lang.id === _lang.id ? 'selected' : '');

        expect(wrapper.find(LanguagesMenuItemId).find(showLangId).at(_i).text()).equal(_lang.id);
        expect(wrapper.find(LanguagesMenuItemId).find(showLangId).at(_i).prop('className'))
          .equal(lang.id === _lang.id ? 'selected' : '');

        const countOfItems = wrapper.find(LanguagesMenuItemId).length / languages.length;
        expect(wrapper.find(LanguagesMenuItemId).at(_i * countOfItems).text())
          .equal(_lang.id + ' - ' + _lang.name);
      });
    });

    wrapper.unmount();
  });
});
