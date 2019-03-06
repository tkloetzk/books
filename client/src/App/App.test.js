import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

describe('App', () => {
  let props;
  let wrapper;
  let instance;
  beforeEach(() => {
    props = {
      classes: {},
    };
    wrapper = shallow(<App {...props} />);
    instance = wrapper.instance();
  });
  it('renders', () => {
    expect(wrapper).toMatchSnapshot();
  });
  describe('Switching Tab functionality', () => {
    it('Initial Tab index is 0', () => {
      expect(instance.state.value).toEqual(0);
    });
    it('handleChangeIndex changes tabs', () => {
      instance.handleChangeIndex(1);
      expect(instance.state.value).toEqual(1);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
