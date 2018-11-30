const React = require('react');
const {expect} = require('chai');

const {appPath, mountWithIntl} = require('../_shared.js');
const Terms = require(appPath + 'components/Terms').default.WrappedComponent;

describe('Testing Terms Component.', () => {
  const props = {
    terms: {
      list: []
    }
  }

  it('should show component correctly', () => {
    const wrapper = mountWithIntl(<Terms {...props} />);

    const termsId = '[data-test-id="Terms"]';
    expect(wrapper.find(termsId).exists()).equal(true);

    wrapper.unmount();
  });

  it('should render terms inside table correctly', () => {
    const wrapper = mountWithIntl(<Terms {...props} />);

    const termsArray = [];
    const countTerms = 140;
    for (let i = 0; i < countTerms; i++) {
      termsArray.push({
        wylie: `wylie-${i}`,
        sanskrit_ru: `sanskrit_ru-${i}`,
        sanskrit_EN: `sanskrit_en-${i}`
      })
    }

    wrapper.setProps({
      terms: {
        list: termsArray
      }
    });

    const termsListId = '[data-test-id="terms-list"]';
    expect(wrapper.find(termsListId).children().length).equal(countTerms);

    wrapper.unmount();
  });
});
