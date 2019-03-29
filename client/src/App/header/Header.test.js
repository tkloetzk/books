import React from 'react';
import { shallow } from 'enzyme';
import Header from './Header';

describe('Header', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      children: 'Book Review Aggregator',
      scrollAction: 250,
    };
    wrapper = shallow(<Header {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders with no props', () => {
    wrapper = shallow(<Header />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders with correct props', () => {
    wrapper = shallow(<Header {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
