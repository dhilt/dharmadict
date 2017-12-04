const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  mountWithIntl,
  initialState,
  languages,
  _appPath,
  shallow
} = require('../../_shared.js');

const NewTerm = require(_appPath + 'components/admin/NewTerm').default.WrappedComponent;

describe('Testing NewTerm Component.', () => {

  const props = {
    data: {...initialState.admin.newTerm,
      wylie: 'wylie'
    },
    languages
  };

  const inputSanskritId = '[data-test-id="input-sanskrit"]';
  const inputWylieId = '[data-test-id="input-wylie"]';
  const btnSaveId = '[data-test-id="button-save"]';

  it('should correctly handle actions on the component', () => {
    const spyChangeSanskrit = sinon.spy(NewTerm.prototype, 'onSanskritChange');
    const spyChangeWylie = sinon.spy(NewTerm.prototype, 'onWylieChange');
    const spySaveTerm = sinon.spy(NewTerm.prototype, 'onTermSave');

    const defaultEvent = {
      target: {
        value: 'password'
      }
    };
    const wrapper = shallow(<NewTerm {...props} />);

    wrapper.find(inputWylieId).simulate('change', defaultEvent);
    wrapper.find(btnSaveId).simulate('click', defaultEvent);

    const langLength = languages.length;
    for (let i = 0; i < langLength; i++) {
      wrapper.find(inputSanskritId).at(i).simulate('change', defaultEvent);
    }

    expect(spyChangeSanskrit.callCount).equal(langLength);
    expect(spyChangeWylie.calledOnce).to.equal(true);
    expect(spySaveTerm.calledOnce).to.equal(true);

    wrapper.unmount();
  });

  const mainId = '[data-test-id="NewTerm"]';

  it('should show component correctly', () => {
    const wrapper = shallow(<NewTerm {...props} />);

    expect(wrapper.find(mainId).exists()).equal(true);

    const editedWylie = props.data.wylie + ' new';
    wrapper.setProps({...props,
      data: {...props.data,
        wylie: editedWylie
      }
    });
    expect(wrapper.find(inputWylieId).props().value).equal(editedWylie);

    // problem here...
    languages.forEach((lang, langIndex) => {
      const editedSanskrit = 'new sanskrit on ' + lang.id;
      wrapper.setProps({...props,
        data: {...props.data,
          sanskrit: {...props.data.sanskrit,
            ['sanskrit_' + lang.id]: editedSanskrit
          }
        }
      });
      expect(wrapper.find(inputSanskritId).at(langIndex).props().value).equal(editedSanskrit);
    });

    expect(wrapper.find(btnSaveId).props().className).equal('');
    const expectedClassName = 'loader';
    wrapper.setProps({...props,
      data: {...props.data,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).props().className).equal(expectedClassName);

    wrapper.unmount();
  });

  it('should disable save button on the component', () => {
    const wrapper = shallow(<NewTerm {...props} />);

    wrapper.setProps({...props,
      data: {...props.data,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    wrapper.setProps({...props,
      data: {...props.data,
        wylie: ''
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(true);

    let fullWritedSanskrit = {};
    languages.forEach(lang =>
      fullWritedSanskrit['sanskrit_' + lang.id] = 'sanskrit on ' + lang.id
    );

    wrapper.setProps({...props,
      data: {...props.data,
        sanskrit: fullWritedSanskrit
      }
    });
    expect(wrapper.find(btnSaveId).props().disabled).equal(false);

    languages.forEach(lang => {
      let invalidSanskrit = Object.assign({}, fullWritedSanskrit);
      invalidSanskrit['sanskrit_' + lang.id] = '';
      wrapper.setProps({...props,
        data: {...props.data,
          sanskrit: invalidSanskrit
        }
      });
      expect(wrapper.find(btnSaveId).props().disabled).equal(true);
    });

    wrapper.unmount();
  });

  const arrIntlStringsId = [
    ['[data-test-id="title"]', 'NewTerm.title_new_term'],
    ['[data-test-id="button-cancel"]', 'Common.cancel'],
    [btnSaveId, 'Common.save']
  ];

  languages.forEach(lang => {
    const i18n = require(_appPath + 'i18n/' + lang.id);

    it(`should exists all i18n-texts for the component (${lang.id})`, () =>
      arrIntlStringsId.forEach(couple =>
        expect(i18n.hasOwnProperty(couple[1])).equal(true)
      )
    );

    it(`should show i18n-texts on the component (${lang.id})`, () => {
      const wrapper = mountWithIntl(<NewTerm {...props} />, lang.id);

      let couple = arrIntlStringsId[0];
      expect(wrapper.find(couple[0]).text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[1];
      expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);

      couple = arrIntlStringsId[2];
      expect(wrapper.find(couple[0]).first().text()).equal(i18n[couple[1]]);

      wrapper.unmount();
    });
  });
});
