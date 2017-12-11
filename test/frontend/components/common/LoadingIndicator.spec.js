const React = require('react');
const {expect} = require('chai');

const {
  mountWithIntl,
  getAppPath,
  languages,
  shallow
} = require('../../_shared.js');

const LoadingIndicator = require(getAppPath(2) + 'components/common/LoadingIndicator').default;

describe('Testing LoadingIndicator Component.', () => {

  const LoadingIndicatorId = '[data-test-id="LoadingIndicator"]';

  it('should correctly show the component', () => {
    const wrapper = shallow(<LoadingIndicator />);
    expect(wrapper.find(LoadingIndicatorId).exists()).equal(true);
    wrapper.unmount();
  });

  const intlStringId = 'LoadingIndicator.main_text';

  languages.forEach(lang => {
    const i18n = require(getAppPath(2) + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component (${lang.id})`, () => {
      expect(i18n.hasOwnProperty(intlStringId)).equal(true);
    });

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<LoadingIndicator />, lang.id);

      expect(wrapper.find(LoadingIndicatorId).text()).equal(i18n[intlStringId]);

      wrapper.unmount();
    });
  });
});
