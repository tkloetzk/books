import React from 'react';
import { shallow, mount } from 'enzyme';
import { Bookshelf, mapStateToProps } from './Bookshelf';
import { LOADING_STATUSES } from '../../util/constants';

describe('Bookshelf', () => {
  let props;
  let wrapper;
  let instance;
  let bookshelf;

  beforeEach(() => {
    props = {
      classes: {},
      getBookshelf: jest.fn(),
      updateBookOnBookshelf: jest.fn(() => Promise.resolve()),
      deleteBookOnBookshelf: jest.fn(),
      getAmazonBook: jest.fn(() => Promise.resolve()),
      getGoodreadsBook: jest.fn(() => Promise.resolve()),
      clearBooks: jest.fn(),
      bookshelf: [],
      amazonBooks: [],
      goodreadsBooks: [],
      selectedGenres: [],
      filters: [],
      active: true,
    };
    wrapper = shallow(<Bookshelf {...props} />);
    instance = wrapper.instance();
    bookshelf = [
      {
        amazonAverageRating: 4.6,
        amazonRatingsCount: 113,
        categories: ['Family & Relationships'],
        description:
          'A complete guide to the concept of attachment parenting, which argues that parental responsiveness to a baby\'s needs leads to a well-adjusted child, offers tips on breastfeeding on demand, responding to a baby\'s cries, minimizing parent-child separation, and avoiding baby "gadgets." Original.',
        goodreadsAverageRating: 4.22,
        goodreadsRatingsCount: 236,
        isbn: '9780988995819',
        price: '',
        _id: 'as234123',
        subtitle: 'Instinctive Care for Your Baby and Young Child',
        thumbnail:
          'http://books.google.com/books/content?id=daeq84DTC3IC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        title: 'Attachment Parenting',
        owned: true,
        read: false,
      },
    ];
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('renders', () => {
    it('does not with active false', () => {
      props = Object.assign({}, props, {
        active: false,
      });
      wrapper = shallow(<Bookshelf {...props} />);
      expect(instance.props.getBookshelf).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
    it('with no books on bookshelf', () => {
      wrapper = shallow(<Bookshelf {...props} />);
      expect(instance.props.getBookshelf).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
    it('with books on bookshelf', () => {
      props = Object.assign({}, props, {
        propBookshelf: bookshelf,
      });
      wrapper = shallow(<Bookshelf {...props} />);
      instance.state.bookshelf = bookshelf
      expect(instance.props.getBookshelf).toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });
  describe('componentDidUpdate', () => {
    let prevState;
    beforeEach(() => {
      prevState = { bookshelfToUpdate: [] };
      jest.spyOn(instance, 'createPromiseArray');
      jest.spyOn(instance, 'findAndMergeInUpdates');
    });
    it('calls createPromiseArray when bookshelfToUpdate has a length', () => {
      instance.state.bookshelfToUpdate = bookshelf;

      instance.componentDidUpdate({ propBookshelf: bookshelf }, prevState);
      expect(instance.createPromiseArray).toHaveBeenCalledTimes(1);
      expect(instance.findAndMergeInUpdates).toHaveBeenCalledTimes(0);
      expect(instance.props.clearBooks).toHaveBeenCalledTimes(0);
      expect(instance.props.getBookshelf).toHaveBeenCalledTimes(1);
    });
    it('calls findAndMergeInUpdates when promise calls finish successfully', () => {
      instance.state.bookshelfToUpdate = bookshelf;
      instance.state.amazonBookLoading = LOADING_STATUSES.success;
      instance.state.goodreadsBookLoading = LOADING_STATUSES.success;

      prevState = Object.assign({}, prevState, {
        bookshelfToUpdate: bookshelf,
      });
      instance.componentDidUpdate({propBookshelf: []}, prevState);
      expect(instance.createPromiseArray).toHaveBeenCalledTimes(0);
      expect(instance.findAndMergeInUpdates).toHaveBeenCalledTimes(1);
      expect(instance.props.clearBooks).toHaveBeenCalledTimes(0);
      expect(instance.props.getBookshelf).toHaveBeenCalledTimes(1);
    });
    //TODO: test when promise calls finish with a failure
    it('clears amazon and goodreads books and reloads the bookshelf', () => {
      props = Object.assign({}, props, {
        selectedGenres: [...bookshelf[0].categories],
      });
      prevState = Object.assign({}, prevState, {
        completed: 99,
      });

      wrapper = shallow(<Bookshelf {...props} />);
      instance = wrapper.instance();
      instance.state.completed = 100;

      instance.componentDidUpdate({propBookshelf: bookshelf}, prevState);

      // expect(instance.props.getBookshelf).not.toHaveBeenCalled();
      expect(instance.props.clearBooks).toHaveBeenCalledTimes(1);
      expect(instance.state.loading).toEqual(LOADING_STATUSES.success);
    });
  });
  describe('Refresh Bookshelf', () => {
    beforeEach(() => {
      bookshelf = bookshelf.concat([
        { isbn: '5678', owned: false, read: true },
      ]);
      props = Object.assign({}, props, { bookshelf });

      wrapper = shallow(<Bookshelf {...props} />);
      instance = wrapper.instance();
    });
    describe('refreshBookshelf', () => {
      it('creates bookshelfToUpdate with no filters', () => {
        instance.state.bookshelf = bookshelf
        instance.refreshBookshelf();
        expect(instance.state.completed).toEqual(0);
        expect(instance.state.loading).toEqual(LOADING_STATUSES.loading);
        expect(instance.state.amazonBookLoading).toEqual(
          LOADING_STATUSES.loading
        );
        expect(instance.state.goodreadsBookLoading).toEqual(
          LOADING_STATUSES.loading
        );

        expect(instance.state.bookshelfToUpdate).toEqual(bookshelf);
      });
      it('creates bookshelfToUpdate with owned filter', () => {
        props = Object.assign({}, props, {
          filters: [
            { key: 'owned', value: true },
            { key: 'read', value: false },
          ],
        });

        wrapper = shallow(<Bookshelf {...props} />);
        instance = wrapper.instance();
        instance.state.bookshelf = bookshelf
        instance.refreshBookshelf();

        expect(instance.state.completed).toEqual(0);
        expect(instance.state.loading).toEqual(LOADING_STATUSES.loading);
        expect(instance.state.amazonBookLoading).toEqual(
          LOADING_STATUSES.loading
        );
        expect(instance.state.goodreadsBookLoading).toEqual(
          LOADING_STATUSES.loading
        );

        expect(instance.state.bookshelfToUpdate).toEqual([bookshelf[0]]);
      });
      it('creates bookshelfToUpdate with read filter', () => {
        props = Object.assign({}, props, {
          filters: [
            { key: 'read', value: true },
            { key: 'owned', value: false },
          ],
        });

        wrapper = shallow(<Bookshelf {...props} />);
        instance = wrapper.instance();
        instance.state.bookshelf = bookshelf
        instance.refreshBookshelf();

        expect(instance.state.completed).toEqual(0);
        expect(instance.state.loading).toEqual(LOADING_STATUSES.loading);
        expect(instance.state.amazonBookLoading).toEqual(
          LOADING_STATUSES.loading
        );
        expect(instance.state.goodreadsBookLoading).toEqual(
          LOADING_STATUSES.loading
        );

        expect(instance.state.bookshelfToUpdate).toEqual([bookshelf[1]]);
      });
      it('creates bookshelfToUpdate with both filters', () => {
        props = Object.assign({}, props, {
          filters: [
            { key: 'read', value: true },
            { key: 'owned', value: true },
          ],
        });

        wrapper = shallow(<Bookshelf {...props} />);
        instance = wrapper.instance();
        instance.state.bookshelf = bookshelf
        instance.refreshBookshelf();

        expect(instance.state.completed).toEqual(0);
        expect(instance.state.loading).toEqual(LOADING_STATUSES.loading);
        expect(instance.state.amazonBookLoading).toEqual(
          LOADING_STATUSES.loading
        );
        expect(instance.state.goodreadsBookLoading).toEqual(
          LOADING_STATUSES.loading
        );

        expect(instance.state.bookshelfToUpdate).toEqual(bookshelf);
      });
    });

    describe('createPromiseArray', () => {
      it('creates amazon and goodreads promise arrays', () => {
        instance.state.bookshelfToUpdate = bookshelf;
        instance.createPromiseArray();
        expect(instance.props.getAmazonBook.mock.calls).toMatchSnapshot();
        expect(instance.props.getGoodreadsBook.mock.calls).toMatchSnapshot();
      });
    });
    describe('findAndMergeInUpdates', () => {
      it('updates books with differences', () => {
        props = Object.assign({}, props, {
          goodreadsBooks: [
            {
              goodreadsAverageRating: 2.5,
              goodreadsRatingsCount: 20,
              isbn: '0000000000',
            },
            {
              goodreadsAverageRating: 2.5,
              goodreadsRatingsCount: 20,
              isbn: '001234567890',
            },
            {
              goodreadsAverageRating: 3.5,
              goodreadsRatingsCount: 220,
              isbn: '9780988995819',
            },
          ],
          amazonBooks: [
            {
              amazonAverageRating: 4.5,
              amazonRatingsCount: 22,
              isbn: '9780988995819',
            },
            {
              amazonAverageRating: 3.5,
              amazonRatingsCount: 322,
              isbn: '001234567890',
            },
            {
              amazonAverageRating: 4.5,
              amazonRatingsCount: 22,
              isbn: '0000000000',
            },
          ],
        });

        wrapper = shallow(<Bookshelf {...props} />);
        instance = wrapper.instance();

        instance.state.bookshelfToUpdate = [
          ...bookshelf,
          {
            goodreadsAverageRating: 3,
            goodreadsRatingsCount: 20,
            amazonAverageRating: 5,
            amazonRatingsCount: 1234,
            isbn: '001234567890',
            _id: 'a1',
          },

          {
            goodreadsAverageRating: 2.5,
            goodreadsRatingsCount: 20,
            amazonAverageRating: 4.5,
            amazonRatingsCount: 22,
            isbn: '0000000000',
            _id: 'b2',
          },
        ];
        instance.findAndMergeInUpdates();
        expect(
          instance.props.updateBookOnBookshelf.mock.calls
        ).toMatchSnapshot();
        expect(instance.state.allDifferencesArray).toEqual([{"differences": [{"amazonAverageRating": 3.5, "amazonRatingsCount": 322, "goodreadsAverageRating": 2.5}, {"amazonRatingsCount": 322}, {"goodreadsAverageRating": 2.5}], "id": "a1"}, {"differences": [{"amazonAverageRating": 4.5, "amazonRatingsCount": 22, "goodreadsAverageRating": 3.5, "goodreadsRatingsCount": 220}, {"amazonRatingsCount": 22}, {"goodreadsAverageRating": 3.5}, {"goodreadsRatingsCount": 220}], "id": "as234123"}])
        expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(2);
        expect(instance.state.bookshelfToUpdate).toEqual([]);
        expect(instance.props.getBookshelf.mock.calls).toMatchSnapshot();
      });
      it('does not update if no book differences', () => {
        props = Object.assign({}, props, {
          goodreadsBooks: [
            {
              goodreadsAverageRating: bookshelf.goodreadsAverageRating,
              goodreadsRatingsCount: bookshelf.goodreadsRatingsCount,
              isbn: '9780988995819',
            },
          ],
          amazonBooks: [
            {
              amazonAverageRating: bookshelf.amazonAverageRating,
              amazonRatingsCount: bookshelf.amazonRatingsCount,
              isbn: '9780988995819',
            },
          ],
        });
        instance.state.bookshelfToUpdate = bookshelf;
        instance.findAndMergeInUpdates();
        expect(instance.state.allDifferencesArray).toEqual([])
        expect(
          instance.props.updateBookOnBookshelf.mock.calls
        ).toMatchSnapshot();
        expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledTimes(0);
        expect(instance.state.bookshelfToUpdate).toEqual([]);
      });
      it('does not update book if values are zero but previous ones werent', () => {
        props = Object.assign({}, props, {
          goodreadsBooks: [
            {
              goodreadsAverageRating: 0,
              goodreadsRatingsCount: 0,
              isbn: '9780988995819',
            },
          ],
          amazonBooks: [
            {
              amazonAverageRating: 1234,
              amazonRatingsCount: 1234,
              isbn: '9780988995819',
            },
          ],
        });
        instance.state.bookshelfToUpdate = bookshelf;
        instance.findAndMergeInUpdates();
        expect(instance.state.allDifferencesArray).toEqual([])
        expect(instance.props.updateBookOnBookshelf).not.toHaveBeenCalled()
        expect(instance.state.bookshelfToUpdate).toEqual([]);
      })
    });
  });
  it('mapStateToProps', () => {
    const mockedState = {
      bookshelf: {
        bookshelf: [{ title: 'title' }],
      },
      amazon: {
        books: [{ title: 'amazonBook' }],
      },
      goodreads: {
        books: [{ title: 'goodreadsBook' }],
      },
    };
    const state = mapStateToProps(mockedState);
    expect(state).toEqual({
      propBookshelf: mockedState.bookshelf.bookshelf,
      amazonBooks: mockedState.amazon.books,
      goodreadsBooks: mockedState.goodreads.books,
    });
  });
  describe('handleSave', () => {
    it('calls successfully', () => {
      bookshelf[0]._id = '1234';
      const edits = [
        { key: 'title', currentValue: 'Femininity', newValue: 'Femininity1' },
        { key: 'amazonAverageRating', currentValue: 4.6, newValue: '4.65' },
      ];
      instance.handleSave(...bookshelf, edits);
      expect(instance.props.updateBookOnBookshelf).toHaveBeenCalledWith(
        bookshelf[0]._id,
        { amazonAverageRating: '4.65', title: 'Femininity1' },
        false
      );
    });
  });
});
