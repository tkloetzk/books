import React from 'react';
import { shallow } from 'enzyme';
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders with correct props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('updates state when handleOwned is called', () => {
    instance.handleOwned('owned');
    expect(instance.state.filters).toEqual({ read: false, owned: true });

    instance.handleOwned('read');
    expect(instance.state.filters).toEqual({ read: true, owned: true });

    instance.handleOwned('owned');
    expect(instance.state.filters).toEqual({ read: true, owned: false });

    instance.handleOwned('read');
    expect(instance.state.filters).toEqual({ read: false, owned: false });
  });

  it('calls filterBookshelf when filters are updated', () => {
    const prevState = { read: false, owned: false };
    const filterState = { read: true, owned: false };
    instance.state.filters = filterState;
    instance.componentDidUpdate(null, prevState);
    expect(instance.props.filterBookshelf).toHaveBeenCalled();
    expect(instance.props.filterBookshelf).toHaveBeenCalledWith(filterState);
  });
});
