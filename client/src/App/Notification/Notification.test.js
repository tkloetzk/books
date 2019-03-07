import React from 'react';
import Notification from './Notification';
import { mount } from 'enzyme';
import { LOADING_STATUSES } from '../../util/constants';

describe('Notification', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      classes: {},
      open: false,
      handleClose: jest.fn(),
      autoHideDuration: 4000,
      message: '',
      type: LOADING_STATUSES.initial,
    };
    wrapper = mount(<Notification {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders null with no props', () => {
    const noPropsWrapper = mount(<Notification />);
    expect(noPropsWrapper).toMatchSnapshot();
  });
  it('render null with no message', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('render null with no type', () => {
    props = Object.assign({ message: 'Message', type: null });
    wrapper = mount(<Notification {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('render with correct success props', () => {
    props = Object.assign({
      message: 'Success',
      open: true,
      type: LOADING_STATUSES.success,
    });
    wrapper = mount(<Notification {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('render with correct success props', () => {
    props = Object.assign({
      message: 'Errored',
      open: true,
      type: LOADING_STATUSES.errored,
    });
    wrapper = mount(<Notification {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
