const React = require('react');
const {expect} = require('chai');
const {shallow, configure} = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');
configure({ adapter: new Adapter() });

const {appPath, languages} = require('../_shared.js');
const NotFound = require(appPath + 'components/NotFound').default;

describe('Testing NotFound Component.', () => {

  it('should show component correctly', () => {
    const wrapper = shallow(<NotFound />);

    expect(wrapper.find('[data-test-id="NotFound"]').exists()).equal(true);

    const headingId = '[data-test-id="heading"]';
    const i18nMainTextId = 'NotFound.main_text';
    expect(wrapper.find(headingId).exists()).equal(true);
    expect(wrapper.find(headingId).children().props().id).equal(i18nMainTextId);

    const backLinkId = '[data-test-id="back_link"]';
    const i18nBackLinkId = 'NotFound.go_home';
    expect(wrapper.find(backLinkId).props().to).equal('/');
    expect(wrapper.find(backLinkId).children().props().id).equal(i18nBackLinkId);

    wrapper.unmount();
  });

  it('should exists all i18n-texts for the component', () => {
    languages.forEach(lang => {
      const i18n = require(appPath + 'i18n/' + lang.id);
      [
        'NotFound.main_text',
        'NotFound.go_home'
      ].forEach(elem => expect(i18n.hasOwnProperty(elem)).equal(true));
    });
  });
});
