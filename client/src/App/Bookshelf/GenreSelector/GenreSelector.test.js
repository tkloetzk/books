import React from 'react';
import { shallow } from 'enzyme';
import { GenreSelector } from './GenreSelector';
import dropRight from 'lodash/dropRight'

describe('GenreSelector', () => {
  let props;
  let wrapper;
  let instance;
  let bookshelf;
  let genres;
  let book;

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
        "read":false,
        "owned":false,
        "title":"After God's Own Heart1",
        "subtitle":"",
        "isbn":"9780736917728",
        "description":"Elizabeth George, bestselling author and mother of two daughters",
        "amazonAverageRating":4.6,
        "amazonRatingsCount":29,
        "goodreadsAverageRating":4.25,
        "goodreadsRatingsCount":149,
        "thumbnail":"http://books.google.com/books/content?id=K_AhmQEACAAJ",
      },
      {
        categories: ['Fatherhood'],
        "read":false,
        "owned":false,
        "_id":"5c9e4509cad5d55ca38e6e4d",
        "amazonAverageRating":4.7,
        "amazonRatingsCount":1916,
        "price":"",
        "isbn":"9780064404990",
        "title":"Year of the Griffin",
        "subtitle":"",
        "description":"It is eight years after the tours",
        thumbnail: "http://books.google.com/books/content",
        "goodreadsAverageRating":4.21,
        "goodreadsRatingsCount":1860898,
      },
    ];

    genres = [
      {
        category: 'Religion',
        checked: false,
      },
      {
        category: 'Fatherhood',
        checked: false,
      },
    ];
    book = {
      categories: ['Motherhood'],
      "read":false,
      "owned":false,
      "title":"Motherhood book",
      "subtitle":"",
      "isbn":"9780737281111",
      "description":"Description",
      "amazonAverageRating":3.6,
      "amazonRatingsCount":39,
      "goodreadsAverageRating":3.25,
      "goodreadsRatingsCount":339,
      "thumbnail":"http://books.google.com/books/content?id=K_SDFasdf"
    }
  });
  afterEach(() => {
    jest.resetAllMocks()
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

      expect(instance.props.getBookshelf).not.toHaveBeenCalled()
      expect(wrapper).toMatchSnapshot();
    });
    describe('componentDidUpdate', () => {
      let prevProps
      let prevState
      let propsBookshelf
      const categories = [{"category": "Religion", "checked": false}, {"category": "Fatherhood", "checked": false}]

      beforeEach(() => {
        prevProps = Object.assign({}, props, { bookshelf });
        prevState = {
          deselectAll: false,
          genres,
          selectAll: true,
        };
        propsBookshelf = Array.from(bookshelf);
      })
      describe('genre selections', () => {
        it('updates state correctly and calls getBookshelf with selected genre', () => {
          props = Object.assign({}, props, { bookshelf: propsBookshelf });
          wrapper = shallow(<GenreSelector {...props} />);
          instance = wrapper.instance();
          instance.state.genres = genres;
          instance.props.getBookshelf.mockReturnValueOnce({bookshelf: [bookshelf[0]]})
          
          instance.handleChange({target: { value: categories[0].category, checked: true }})
          expect(instance.state.genres).toEqual([{"category": categories[0].category, "checked": true}, categories[1]])
          expect(instance.state.deselectAll).toEqual(false)
          expect(instance.state.selectAll).toEqual(false)
          expect(instance.props.getBookshelf).toHaveBeenCalledWith([categories[0].category])
          expect(instance.props.bookshelf.length).toEqual()
        })
      })
      describe('select all', () => {
        it('selects all categories when select all is checked', () => {
          props = Object.assign({}, props, { bookshelf: propsBookshelf });
          wrapper = shallow(<GenreSelector {...props} />);
          instance = wrapper.instance();
          instance.state.genres = genres;
          instance.state.genres[0].checked = true
          
          instance.handleSelectAll({target: { checked: true}})
          
          expect(instance.state.genres).toEqual(categories)
          expect(instance.state.selectAll).toEqual(true)
          expect(instance.state.deselectAll).toEqual(false)
        })
      })
      describe('inserts', () => {
        it('renders correctly and updates after a new book with new category is inserted', () => {
          propsBookshelf.push(book);
          props = Object.assign({}, props, { bookshelf: propsBookshelf });
          wrapper = shallow(<GenreSelector {...props} />);
          instance = wrapper.instance();
          instance.state.genres = genres;
          expect(instance.state.genres).toEqual(categories)
          instance.componentDidUpdate(prevProps, prevState);
    
          expect(instance.state.genres).toEqual([...categories, {"category": book.categories[0], "checked": false}]);
          expect(wrapper).toMatchSnapshot();
        });
        it('renders correctly and does not update state when a new book is inserted with an exisiting category', () => {
          book.categories = ['Religion']
          propsBookshelf.push(book);
          props = Object.assign({}, props, { bookshelf: propsBookshelf });
          wrapper = shallow(<GenreSelector {...props} />);
          instance = wrapper.instance();
          instance.state.genres = genres;
          expect(instance.state.genres).toEqual(categories)
          instance.componentDidUpdate(prevProps, prevState);
    
          expect(instance.state.genres).toEqual(categories);
          expect(wrapper).toMatchSnapshot();
        })
        it('renders correctly and updates state with new categories when a new book is inserted with multiple categories', () => {
          book.categories = ['Religion', 'Parenting', 'Dog']
          propsBookshelf.push(book);
          props = Object.assign({}, props, { bookshelf: propsBookshelf });
          wrapper = shallow(<GenreSelector {...props} />);
          instance = wrapper.instance();
          instance.state.genres = genres;
          expect(instance.state.genres).toEqual(categories)
          instance.componentDidUpdate(prevProps, prevState);
    
          expect(instance.state.genres).toEqual([...categories, {"category": book.categories[1], "checked": false}, {"category": book.categories[2], "checked": false}]);
          expect(wrapper).toMatchSnapshot();
        })
      })
      describe('deletes', () => {
        it('removes category from state when the only book with that category is deleted', () => {
          props = Object.assign({}, props, { bookshelf: dropRight(bookshelf, 1) });
          expect(props.bookshelf.length).toEqual(1)
          wrapper = shallow(<GenreSelector {...props} />);
          instance = wrapper.instance();
          instance.state.genres = genres;
          expect(instance.state.genres).toEqual(categories)
          instance.componentDidUpdate(prevProps, prevState);
    
          expect(instance.state.genres).toEqual([genres[0]]);
          expect(wrapper).toMatchSnapshot();
        })
      })
    })
  });
});
