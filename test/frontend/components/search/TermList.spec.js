const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {getAppPath, shallow, terms} = require('../../_shared.js');

const TermList = require(getAppPath(2) + 'components/search/TermList').default.WrappedComponent;

describe('Testing TermList Component.', () => {

  const props = {
    termList: terms,
    isTermSelected: () => true
  };

  const itemTermId = '[data-test-id="item-term"]';

  it('should correctly handle actions on the component', () => {
    const spyOnSelectTerm = sinon.spy(TermList.prototype, 'onSelectTerm');
    const wrapper = shallow(<TermList {...props} />);

    let termsCount = 0;
    terms.forEach((term, i) => {
      wrapper.find(itemTermId).at(i).simulate('click', term);
      termsCount++;
    });
    expect(spyOnSelectTerm.callCount).equal(termsCount);

    wrapper.unmount();
  });

  const mainId = '[data-test-id="TermList"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<TermList {...props} />);
    expect(wrapper.find(mainId).exists()).equal(true);
    wrapper.unmount();
  });
});
