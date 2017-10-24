const React = require('react');
const {Component} = require('react');
const {expect} = require('chai');

const NotFound = require('../../../app/components/NotFound').default;
const {setupComponent, defaultLang} = require('../_shared.js');

const i18n = require('../../../app/i18n/' + defaultLang);

describe('Testing NotFound Component.', () => {
  it('should show component', () => {
    const wrapper = setupComponent(NotFound);

    expect(wrapper.find('article')).to.exist;
    expect(wrapper.find('h1').text()).equal(i18n['NotFound.main_text']);
    expect(wrapper.find('a').text()).equal(i18n['NotFound.go_home']);
    expect(wrapper.find('a').hasClass('btn')).equal(true);
  });
});
