import React, {Component} from 'react';
import {expect} from 'chai';
import {shallow, mount, render, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
configure({ adapter: new Adapter() });

import NotFound from '../../../app/components/NotFound';

describe('Testing NotFound Component.', () => {
  it('should ...', () => {
    const wrapper = shallow(
      <NotFound />
    );
    expect(wrapper.text()).equal('<FormattedMessage /><Link />');
  });
});
