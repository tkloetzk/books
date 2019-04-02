import React from 'react';
import { mount, shallow } from 'enzyme';
import { Filters } from './Filters';

describe('Filters', () => {
  let props;
  let wrapper;
  let instance;
  beforeEach(() => {
    props = {
      classes: {},
      filterBookshelf: jest.fn(),
    };

    wrapper = shallow(<Filters {...props} />);
    instance = wrapper.instance();
  });

  it('renders with no function passed in', () => {
    wrapper = shallow(<Filters classes={{}} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with correct props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('updates state when handleOwned is called', () => {
    instance.handleOwned('owned');
    expect(instance.state.filters).toEqual([
      { key: 'unread', value: false },
      { key: 'owned', value: true },
    ]);

    instance.handleOwned('unread');
    expect(instance.state.filters).toEqual([
      { key: 'unread', value: true },
      { key: 'owned', value: true },
    ]);

    instance.handleOwned('owned');
    expect(instance.state.filters).toEqual([
      { key: 'unread', value: true },
      { key: 'owned', value: false },
    ]);

    instance.handleOwned('unread');
    expect(instance.state.filters).toEqual([
      { key: 'unread', value: false },
      { key: 'owned', value: false },
    ]);
  });

  it('calls filterBookshelf when filters are updated', () => {
    const prevState = [
      { key: 'unread', value: false },
      { key: 'owned', value: false },
    ];
    const filterState = [
      { key: 'unread', value: true },
      { key: 'owned', value: false },
    ];
    instance.state.filters = filterState;
    instance.componentDidUpdate(null, prevState);
    expect(instance.props.filterBookshelf).toHaveBeenCalled();
    expect(instance.props.filterBookshelf).toHaveBeenCalledWith(filterState);
  });
  it('does not call filterBookshelf when filters are not updated', () => {
    const filters = [
      { key: 'unread', value: false },
      { key: 'owned', value: false },
    ];
    instance.state.filters = filters;
    instance.componentDidUpdate(null, { filters });
    expect(instance.props.filterBookshelf).not.toHaveBeenCalled();
  });
});
