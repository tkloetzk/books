import React from 'react';
import Tooltip from './Tooltip';
import { shallow } from 'enzyme';
import forEach from 'lodash/forEach';
import { LOADING_STATUSES } from '../../util/constants';

describe('Tooltip', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = { conent: { label: 'Amazon', loading: 'AMAZON_LOADING' } };
    wrapper = shallow(<Tooltip {...props} />);
    instance = wrapper.instance();
  });
  it('renders with no props', () => {
    wrapper = shallow(<Tooltip />);
    expect(wrapper).toMatchSnapshot();
  });
  it('renders correctly with no content in props', () => {
    props = Object.assign({}, props, { content: '' });
    wrapper = shallow(<Tooltip {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
  it('renders with correct props', () => {
    forEach(LOADING_STATUSES, status => {
      props = Object.assign({}, props, {
        content: [{ label: 'Amazon', loading: status }],
      });
      wrapper = shallow(<Tooltip {...props} />);

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
