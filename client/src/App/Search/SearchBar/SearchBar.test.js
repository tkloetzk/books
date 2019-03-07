import React from 'react';
import { shallow, mount } from 'enzyme';
import { SearchBar } from './SearchBar';
import Button from '@material-ui/core/Button';

describe('SearchBar', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = { classes: {}, clearBooks: jest.fn() };
    wrapper = shallow(<SearchBar {...props} />);
    instance = wrapper.instance();
    instance.search = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    wrapper = shallow(<SearchBar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe('search', () => {
    describe('button', () => {
      it('disabled if no text', () => {
        wrapper.setState({
          loading: false,
          multiline: '',
        });
        expect(
          wrapper
            .find(Button)
            .at(0)
            .props().disabled
        ).toBe(true);
      });
      it('disabled if loading', () => {
        wrapper.setState({
          loading: true,
          multiline: 'ISBN',
        });
        expect(
          wrapper
            .find(Button)
            .at(0)
            .props().disabled
        ).toBe(true);
      });
    });
    describe('bar', () => {
      it('handleChange updates state', () => {
        instance.handleChange({ target: { value: 'update state' } });
        expect(instance.state.multiline).toEqual('update state');
      });
    });
  });
});
