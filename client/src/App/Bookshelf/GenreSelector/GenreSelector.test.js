import React from 'react';
import { shallow } from 'enzyme';
import { GenreSelector } from './GenreSelector';

describe('GenreSelector', () => {
  let props;
  let wrapper;
  let instance;
  let bookshelf;

  beforeEach(() => {
    props = {
      classes: {},
      getBookshelf: jest.fn(),
      bookshelf: [],
    };
    wrapper = shallow(<GenreSelector {...props} />);
    instance = wrapper.instance();
    bookshelf = [
      {
        categories: ['Religion'],
      },
      {
        categories: ['Fatherhood'],
      },
    ];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('renders', () => {
    it('null with no props', () => {
      wrapper = shallow(<GenreSelector />);
      expect(wrapper).toMatchSnapshot();
    });
    it('no genres with no books', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('as expected with bookshelf on initial load', () => {
      const prevProps = { bookshelf: [] };
      const prevState = { deselectAll: false, genres: [], selectAll: true };
      props = Object.assign({}, props, { bookshelf });

      wrapper = shallow(<GenreSelector {...props} />);
      instance = wrapper.instance();
      instance.componentDidUpdate(prevProps, prevState);

      expect(wrapper).toMatchSnapshot();
    });
    it('as expected with bookshelf after a save', () => {
      // NOT WORKING
    });
  });
});
