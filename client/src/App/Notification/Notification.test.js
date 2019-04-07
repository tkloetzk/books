import React from 'react';
import Notification from './Notification';
import { shallow } from 'enzyme';
import { LOADING_STATUSES } from '../../util/constants';
import forEach from 'lodash/forEach';

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
    wrapper = shallow(<Notification {...props} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders null with no props', () => {
    const noPropsWrapper = shallow(<Notification />);
    expect(noPropsWrapper).toMatchSnapshot();
  });
  it('render null with no message', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('render null with no type', () => {
    props = Object.assign({ message: 'Message', type: null });
    wrapper = shallow(<Notification {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  forEach(LOADING_STATUSES, status => {
    it(`render with correct ${status} props`, () => {
      props = Object.assign({}, props, {
        message: status,
        open: true,
        type: status,
      });
      wrapper = shallow(<Notification {...props} />);

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
