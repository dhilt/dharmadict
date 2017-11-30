const React = require('react');
const {expect} = require('chai');

const {appPath, languages, shallow, mountWithIntl} = require('../_shared.js');
const NotFound = require(appPath + 'components/NotFound').default;

describe('Testing NotFound Component.', () => {

  it('should show component correctly', () => {
    const wrapper = shallow(<NotFound />);

    const notFoundId = '[data-test-id="NotFound"]';
    expect(wrapper.find(notFoundId).exists()).equal(true);

    wrapper.unmount();
  });

  it('should exists all i18n-texts for the component', () => {
    const arrIntlStringsId = [
      ['[data-test-id="heading"]', 'NotFound.main_text'],
      ['[data-test-id="back_link"]', 'NotFound.go_home']
    ];

    languages.forEach(lang => {
      const wrapper = mountWithIntl(<NotFound />, lang.id);
      const i18n = require(appPath + 'i18n/' + lang.id);

      arrIntlStringsId.forEach(couple => {
        expect(i18n.hasOwnProperty(couple[1])).equal(true);
        expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);
      });

      wrapper.unmount();
    });
  });
});
