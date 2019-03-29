import React from 'react';
import { shallow } from 'enzyme';
import { GenreSelector } from './GenreSelector';

describe('GenreSelector', () => {
  let props;
  let wrapper;
  let instance;
  let bookshelf;
  let genres;
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

    genres = [
      {
        categories: ['Religion'],
        checked: false,
      },
      {
        categories: ['Fatherhood'],
        checked: false,
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
    it('as expected with bookshelf after a new book with new category is inserted', () => {
      // const prevProps = Object.assign({}, props, { bookshelf });
      // const prevState = {
      //   deselectAll: false,
      //   genres,
      //   selectAll: true,
      // };
      // const propsBookshelf = Array.from(bookshelf);
      // propsBookshelf.push({
      //   categories: ['Motherhood'],
      // });
      // props = Object.assign({}, props, { bookshelf: propsBookshelf });
      // wrapper = shallow(<GenreSelector {...props} />);
      // instance = wrapper.instance();
      // instance.state.genres = genres;
      // instance.componentDidUpdate(prevProps, prevState);
      // const newStateGenres = Array.from(genres);
      // newStateGenres.push({
      //   categories: ['Motherhood'],
      //   checked: false,
      // });
      // expect(instance.state.genres).toEqual(newStateGenres);
    });
  });
});
