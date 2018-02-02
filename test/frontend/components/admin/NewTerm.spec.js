const React = require('react');
const {expect} = require('chai');
const sinon = require('sinon');

const {
  initialState,
  getAppPath,
  languages,
  shallow
} = require('../../_shared.js');

const NewTerm = require(getAppPath(2) + 'components/admin/NewTerm').default.WrappedComponent;

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
    expect(spyChangeWylie.calledOnce).equal(true);
    expect(spySaveTerm.calledOnce).equal(true);

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
    expect(wrapper.find(inputWylieId).prop('value')).equal(editedWylie);

    languages.forEach((lang, langIndex) => {
      const editedSanskrit = 'new sanskrit on ' + lang.id;
      wrapper.setProps({...props,
        data: {...props.data,
          sanskrit: {...props.data.sanskrit,
            ['sanskrit_' + lang.id]: editedSanskrit
          }
        }
      });
      expect(wrapper.find(inputSanskritId).at(langIndex).prop('value')).equal(editedSanskrit);
    });

    expect(wrapper.find(btnSaveId).prop('className')).equal('');
    const expectedClassName = 'loader';
    wrapper.setProps({...props,
      data: {...props.data,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).prop('className')).equal(expectedClassName);

    wrapper.unmount();
  });

  it('should disable save button on the component', () => {
    const wrapper = shallow(<NewTerm {...props} />);

    wrapper.setProps({...props,
      data: {...props.data,
        pending: true
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    wrapper.setProps({...props,
      data: {...props.data,
        wylie: ''
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);

    let fullWritedSanskrit = {};
    languages.forEach(lang =>
      fullWritedSanskrit['sanskrit_' + lang.id] = 'sanskrit on ' + lang.id
    );

    wrapper.setProps({...props,
      data: {...props.data,
        sanskrit: fullWritedSanskrit
      }
    });
    expect(wrapper.find(btnSaveId).prop('disabled')).equal(false);

    languages.forEach(lang => {
      let invalidSanskrit = Object.assign({}, fullWritedSanskrit);
      invalidSanskrit['sanskrit_' + lang.id] = '';
      wrapper.setProps({...props,
        data: {...props.data,
          sanskrit: invalidSanskrit
        }
      });
      expect(wrapper.find(btnSaveId).prop('disabled')).equal(true);
    });

    wrapper.unmount();
  });
});
