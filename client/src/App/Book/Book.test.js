import React from 'react';
import { shallow } from 'enzyme';
import { Book } from './Book';

describe('Book', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      handleSave: jest.fn(),
      book: {
        categories: ['Religion'],
        _id: '5c806393df78d5e84f8388ad',
        amazonAverageRating: 4.6,
        amazonRatingsCount: 20,
        price: '',
        isbn: '9780736917728',
        title: "Raising a Daughter After God's Own Heart",
        subtitle: '',
        description:
          'Elizabeth George, bestselling author and mother of two daughters, provides biblical insight and guidance for every mom who wants to lead their daughter to a godly life through example, study, and prayer. Elizabeth includes questions to draw moms and daughter closer as together they pursue spiritual priorities and God s heart."',
        thumbnail:
          'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        goodreadsAverageRating: 4.24,
        goodreadsRatingsCount: 148,
        __v: 0,
        adjustedRating: 4.225772626931567,
      },
    };
    wrapper = shallow(<Book {...props} />);
    instance = wrapper.instance();
    instance.state.expanded = false;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('renders', () => {
    // it('with no props', () => {
    //   wrapper = shallow(<Book />);
    //   expect(wrapper).toMatchSnapshot();
    // });
    it('with correct props', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('componentDidUpdate', () => {
    let prevProps;
    let prevState;

    beforeEach(() => {
      prevProps = {
        book: props.book,
        classes: {},
      };

      const book = Object.assign({}, props.book, { differences: [] });
      prevState = {
        anchorEl: null,
        expanded: false,
        saveIcon: false,
        edits: [],
        originalBook: book,
        book,
      };
    });
    // adjusted rating updated, should update original book
    it('updates book when adjusted rating changes', () => {
      const propBook = Object.assign({}, props.book, { adjustedRating: 3 });
      props = Object.assign({}, props, { book: propBook });
      wrapper = shallow(<Book {...props} />);
      instance = wrapper.instance();
      instance.state.originalBook.adjustedRating = 4.225772626931567;

      instance.componentDidUpdate(prevProps, prevState);

      expect(instance.state.originalBook.adjustedRating).toEqual(3);
    });
    // edited but made no changes
    it('does not update the book edits if no edits were actually made', () => {
      const book = Object.assign({}, props.book, { differences: [] });
      instance.state.book = book;
      instance.state.originalBook = book;
      instance.state.edits = [];

      instance.componentDidUpdate(prevProps, prevState);
      expect(instance.state.edits).toEqual([]);
    });
    // edited initially
    it('updates the book edits if an edit was made', () => {
      let book = Object.assign({}, props.book, {
        title: 'New Title',
        differences: [],
      });
      instance.state.book = book;

      book = Object.assign({}, props.book, { differences: [] });
      instance.state.originalBook = book;
      instance.state.edits = [];

      instance.componentDidUpdate(prevProps, prevState);
      expect(instance.state.edits).toEqual([
        {
          currentValue: props.book.title,
          key: 'title',
          newValue: instance.state.book.title,
        },
      ]);
    });
    // edited then edited again
    it('updates the book edits without removing the previous edits', () => {
      const edits = [
        {
          currentValue: "Raising a Daughter After God's Own Heart",
          key: 'title',
          newValue: 'New Title',
        },
      ];
      let book = Object.assign({}, props.book, {
        title: 'New Title',
        goodreadsAverageRating: 3,
        differences: [],
      });
      instance.state.book = book;
      instance.state.edits = edits;
      prevState.edits = edits;
      prevState.book.title = 'New Title';

      book = Object.assign({}, props.book, { differences: [] });
      instance.state.originalBook = book;

      instance.componentDidUpdate(prevProps, prevState);
      expect(instance.state.edits).toEqual([
        {
          currentValue: props.book.title,
          key: 'title',
          newValue: instance.state.book.title,
        },
        {
          currentValue: props.book.goodreadsAverageRating,
          key: 'goodreadsAverageRating',
          newValue: instance.state.book.goodreadsAverageRating,
        },
      ]);
    });
    // every field is edited
    it('updates the book edits for every field', () => {
      let book = Object.assign({}, props.book, {
        title: 'New Title',
        categories: 'New Category',
        amazonAverageRating: 3,
        amazonRatingsCount: 30,
        description: 'New Descript',
        goodreadsAverageRating: 3.1,
        goodreadsRatingsCount: 18,
        isbn: '123948192',
        differences: [],
      });
      instance.state.book = book;

      book = Object.assign({}, props.book, { differences: [] });
      instance.state.originalBook = book;
      instance.state.edits = [];

      instance.componentDidUpdate(prevProps, prevState);
      expect(instance.state.edits).toEqual([
        {
          currentValue: props.book.categories,
          key: 'categories',
          newValue: ['New Category'],
        },
        {
          currentValue: props.book.amazonAverageRating,
          key: 'amazonAverageRating',
          newValue: instance.state.book.amazonAverageRating,
        },
        {
          currentValue: props.book.amazonRatingsCount,
          key: 'amazonRatingsCount',
          newValue: instance.state.book.amazonRatingsCount,
        },
        {
          currentValue: props.book.isbn,
          key: 'isbn',
          newValue: instance.state.book.isbn,
        },
        {
          currentValue: props.book.title,
          key: 'title',
          newValue: instance.state.book.title,
        },
        {
          currentValue: props.book.description,
          key: 'description',
          newValue: instance.state.book.description,
        },
        {
          currentValue: props.book.goodreadsAverageRating,
          key: 'goodreadsAverageRating',
          newValue: instance.state.book.goodreadsAverageRating,
        },
        {
          currentValue: props.book.goodreadsRatingsCount,
          key: 'goodreadsRatingsCount',
          newValue: instance.state.book.goodreadsRatingsCount,
        },
      ]);
    });
    // owned update
    // read update
  });
  //saveIcon
  describe('_handleFocusOut', () => {
    it('updates state on _handleFocusOut()', () => {
      instance._handleFocusOut('updated text', 'title');
      expect(instance.state.book.title).toEqual('updated text');
    });
  });
  // describe('handleExpandClick', () => {
  //   instance.handleExpandClick();
  //   expect(instance.state.expanded).toBe(true);
  // });
  describe('handleOwnedReadBook', () => {
    it('owned', () => {
      instance.handleOwnedReadBook('owned');
      expect(instance.state.book.owned).toBe(true);

      instance.handleOwnedReadBook('owned');
      expect(instance.state.book.owned).toBe(false);
    });
    it('read', () => {
      instance.handleOwnedReadBook('read');
      expect(instance.state.book.read).toBe(true);

      instance.handleOwnedReadBook('read');
      expect(instance.state.book.read).toBe(false);
    });
  });
});
