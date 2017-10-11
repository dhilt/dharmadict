import React, {Component} from 'react';
import expect from 'expect';

import * as actions from '../../../app/actions/common';
import * as types from '../../../app/actions/_constants';

describe('common actions', () => {
  it('should change language', () => {
    const language = 'en';
    const expectedAction = {
      type: types.SET_LANGUAGE,
      language: language
    };
    expect(actions.changeUserLanguage(language)).toEqual(expectedAction);
  });
})
