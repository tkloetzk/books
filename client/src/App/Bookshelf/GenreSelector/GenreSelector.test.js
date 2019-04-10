import React from 'react';
import { shallow } from 'enzyme';
import { GenreSelector } from './GenreSelector';
import dropRight from 'lodash/dropRight';
import clone from 'lodash/clone';

describe('GenreSelector', () => {
  let props;
  let bookshelf;
  let propGenres;
  let book;
  let genreSelectors;
  let prevState;

  beforeEach(() => {
    props = {
      classes: {},
      getBookshelf: jest.fn(),
      getBookshelfGenres: jest.fn(),
      bookshelf: [],
      genres: [],
    };
    prevState = {
      deselectAll: false,
      genres: [],
      selectAll: true,
      selectChange: false,
      updateGenres: false,
    };
    bookshelf = [
      {
        categories: ['Religion'],
        read: false,
        owned: false,
        title: "After God's Own Heart1",
        subtitle: '',
        isbn: '9780736917728',
        description:
          'Elizabeth George, bestselling author and mother of two daughters',
        amazonAverageRating: 4.6,
        amazonRatingsCount: 29,
        goodreadsAverageRating: 4.25,
        goodreadsRatingsCount: 149,
        thumbnail: 'http://books.google.com/books/content?id=K_AhmQEACAAJ',
      },
      {
        categories: ['Fatherhood'],
        read: false,
        owned: false,
        _id: '5c9e4509cad5d55ca38e6e4d',
        amazonAverageRating: 4.7,
        amazonRatingsCount: 1916,
        price: '',
        isbn: '9780064404990',
        title: 'Year of the Griffin',
        subtitle: '',
        description: 'It is eight years after the tours',
        thumbnail: 'http://books.google.com/books/content',
        goodreadsAverageRating: 4.21,
        goodreadsRatingsCount: 1860898,
      },
    ];

    propGenres = ['Religion', 'Fatherhood'];

    genreSelectors = [
      { category: 'Religion', checked: false },
      { category: 'Fatherhood', checked: false },
    ];
    book = {
      categories: ['Motherhood'],
      read: false,
      owned: false,
      title: 'Motherhood book',
      subtitle: '',
      isbn: '9780737281111',
      description: 'Description',
      amazonAverageRating: 3.6,
      amazonRatingsCount: 39,
      goodreadsAverageRating: 3.25,
      goodreadsRatingsCount: 339,
      thumbnail: 'http://books.google.com/books/content?id=K_SDFasdf',
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
  describe('renders', () => {
    it('renders with no genres', () => {
      const wrapper = shallow(<GenreSelector {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
    it('sets genre state from props.genres', () => {
      const prevProps = [];
      props = Object.assign({}, props, { genres: propGenres });

      const wrapper = shallow(<GenreSelector {...props} />);
      const instance = wrapper.instance();
      instance.componentDidUpdate(prevProps, prevState);

      expect(instance.state.genres).toEqual(genreSelectors);
    });
    // describe('componentDidUpdate', () => {
    //   let prevProps;
    //   let prevState;
    //   let propsBookshelf;
    //   const categories = [
    //     { category: 'Religion', checked: false },
    //     { category: 'Fatherhood', checked: false },
    //   ];

    //   beforeEach(() => {
    //     prevProps = Object.assign({}, props, { bookshelf });
    //     prevState = {
    //       deselectAll: false,
    //       genres,
    //       selectAll: true,
    //     };
    //     propsBookshelf = Array.from(bookshelf);
    //   });
    //   describe('genre selections', () => {
    //     it('updates state correctly and calls getBookshelf with selected genre', () => {
    //       props = Object.assign({}, props, { bookshelf: propsBookshelf });
    //       wrapper = shallow(<GenreSelector {...props} />);
    //       instance = wrapper.instance();
    //       instance.state.genres = genres;
    //       instance.props.getBookshelf.mockReturnValueOnce({
    //         bookshelf: [bookshelf[0]],
    //       });

    //       instance.handleChange({
    //         target: { value: categories[0].category, checked: true },
    //       });
    //       expect(instance.state.genres).toEqual([
    //         { category: categories[0].category, checked: true },
    //         categories[1],
    //       ]);
    //       expect(instance.state.deselectAll).toEqual(false);
    //       expect(instance.state.selectAll).toEqual(false);
    //       expect(instance.props.getBookshelf).toHaveBeenCalledWith([
    //         categories[0].category,
    //       ]);
    //       expect(instance.props.bookshelf.length).toEqual();
    //     });
    //   });
    describe('select all', () => {
      // it('selects all categories when select all is checked', () => {
      //   const newGenreProp = Array.from(propGenres);
      //   newGenreProp.push('Motherhood');
      //   const prevProps = Object.assign({}, props, { genres: propGenres });
      //   prevState = Object.assign({}, prevState, {
      //     genres: [
      //       { category: 'Religion', checked: true },
      //       { category: 'Fatherhood', checked: false },
      //     ],
      //     selectChange: true,
      //     selectAll: false,
      //     deselectAll: false,
      //   });
      //   props = Object.assign({}, props, { genres: propGenres });
      //   const wrapper = shallow(<GenreSelector {...props} />);
      //   const instance = wrapper.instance();
      //   instance.state.genres = genreSelectors;
      //   instance.handleSelectAll({ target: { checked: true } });
      //   expect(instance.state.genres).toEqual(genreSelectors);
      //   expect(instance.state.selectAll).toEqual(true);
      //   expect(instance.state.deselectAll).toEqual(false);
      //   // expect(instance.props.getBookshelf).toHaveBeenCalledTimes(2);
      // });
    });
    describe('inserts', () => {
      it('updates state after a new book with new category is inserted', () => {
        const newGenreProp = Array.from(propGenres);
        newGenreProp.push('Motherhood');
        const prevProps = clone(props);

        props = Object.assign({}, props, { genres: newGenreProp });

        const wrapper = shallow(<GenreSelector {...props} />);
        const instance = wrapper.instance();

        instance.state.genres = genreSelectors;
        instance.componentDidUpdate(prevProps, prevState);

        expect(instance.state.genres).toEqual([
          ...genreSelectors,
          { category: newGenreProp[2], checked: false },
        ]);
        expect(wrapper).toMatchSnapshot();
      });
    });
    describe('deletes', () => {
      it('removes category from state when a category is deleted', () => {
        let prevProps = clone(props);
        prevProps = Object.assign({}, props, { genres: propGenres });
        props = Object.assign({}, props, {
          genres: [propGenres[0]],
        });

        const wrapper = shallow(<GenreSelector {...props} />);
        const instance = wrapper.instance();

        instance.state.genres = genreSelectors;
        instance.componentDidUpdate(prevProps, prevState);
        expect(instance.state.genres).toEqual([genreSelectors[0]]);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
