import * as actions from '../bookshelfActions';
import * as types from '../bookshelfActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';
import {
  addBookshelfService,
  getBookshelfService,
  deleteBookOnBookshelfService,
  updateBookOnBookshelfService,
  getGenresBookshelfService,
} from '../../../services/bookshelfService';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../bookshelfReducer';

const createMockStore = configureMockStore([thunk]);

jest.mock('../../../services/bookshelfService');

describe('bookshelf actions', () => {
  let booklist;
  beforeEach(() => {
    booklist = [
      {
        amazonAverageRating: 4.6,
        amazonRatingsCount: 29,
        price: '',
        isbn: '9780736917728',
        title: "Raising a Daughter After God's Own Heart",
        subtitle: '',
        description:
          'Elizabeth George, bestselling author and mother of two daughters',
        thumbnail:
          'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover',
        categories: ['Religion'],
        goodreadsAverageRating: 4.25,
        goodreadsRatingsCount: 149,
      },
    ];

    addBookshelfService.mockClear();
    getBookshelfService.mockClear();
    deleteBookOnBookshelfService.mockClear();
    updateBookOnBookshelfService.mockClear();
    getGenresBookshelfService.mockClear();
  });

  it('can set booklist book isLoading', () => {
    const action = actions.getBookshelfIsLoading(LOADING_STATUSES.initial);
    expect(action).toEqual({
      type: types.FETCH_BOOKSHELF_IS_LOADING,
      isLoading: LOADING_STATUSES.initial,
    });
  });

  it('can set booklist success', () => {
    const action = actions.getBookshelfSuccess(booklist);
    expect(action).toEqual({
      type: types.FETCH_BOOKSHELF_SUCCESS,
      bookshelf: booklist,
    });
  });

  it('can save combined books success', () => {
    const action = actions.saveCombinedBooksSuccess(booklist);
    expect(action).toEqual({
      type: types.SAVE_COMBINED_BOOKS_SUCCESS,
      booklist,
    });
  });

  it('can save combined books', () => {
    const dispatch = jest.fn();
    actions.saveCombinedBooks(booklist)(dispatch);
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  it('can set filters', () => {
    const filters = [
      { key: 'unread', value: true },
      { key: 'owned', value: false },
    ];
    const actionTrue = actions.filterBookshelf(filters);
    expect(actionTrue).toEqual({
      type: types.FILTER_BOOKSHELF_SUCCESS,
      filters,
    });
  });
  it('can set booklist hasErrored', () => {
    const actionTrue = actions.getBookshelfFailure(true, 'err');
    expect(actionTrue).toEqual({
      type: types.FETCH_BOOKSHELF_HAS_ERRORED,
      hasErrored: true,
      error: 'err',
    });

    const actionFalse = actions.getBookshelfFailure(false, null);
    expect(actionFalse).toEqual({
      type: types.FETCH_BOOKSHELF_HAS_ERRORED,
      hasErrored: false,
      error: null,
    });
  });

  it('can set saveModifiedBooksSuccess', () => {
    let modifiedBooklist = Array.from(booklist);
    modifiedBooklist.differences = [
      { key: 'goodreadsRatingsCount', currentValue: 21543, newValue: 21560 },
    ];
    const action = actions.saveModifiedBooksSuccess(modifiedBooklist);
    expect(action).toEqual({
      type: types.SAVE_MODIFIED_BOOKS_SUCCESS,
      modifiedBooklist,
    });
  });

  it('can saveModifiedBooks', () => {
    let modifiedBooklist = Array.from(booklist);
    modifiedBooklist.differences = [
      { key: 'goodreadsRatingsCount', currentValue: 21543, newValue: 21560 },
    ];
    const dispatch = jest.fn();
    actions.saveModifiedBooks(modifiedBooklist)(dispatch);
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  it('insertModifiedBookSuccess', () => {
    const action = actions.insertModifiedBookSuccess();
    expect(action).toEqual({
      type: types.INSERT_MODIFIED_BOOK_SUCCESS,
    });
  });
  it('insertModifiedBook', () => {
    const dispatch = jest.fn();
    actions.insertModifiedBook(booklist[0])(dispatch);
    expect(dispatch.mock.calls).toMatchSnapshot();
  });
  describe('getBookshelf', () => {
    it('includedGenres = false, no genres selected', () => {
      const dispatch = jest.fn();
      actions.getBookshelf(false)(dispatch);
      expect(dispatch.mock.calls).toMatchSnapshot();
    });
    it('bookshelf returned with includedGenres', () => {
      const store = createMockStore();
      const bookshelf = [
        {
          categories: ['Religion'],
          read: false,
          owned: false,
          _id: '5c959505494f5dd029aeff74',
          amazonAverageRating: 4.6,
          amazonRatingsCount: 29,
          price: '',
          isbn: '9780736917728',
          title: "Raising a Daughter After God's Own Heart",
          subtitle: '',
          description:
            'Elizabeth George, bestselling author and mother of two daughters',
          thumbnail: 'http://books.google.com/books/content?id=K_AhmQEACAAJ&pr',
          goodreadsAverageRating: 4.25,
          goodreadsRatingsCount: 149,
          __v: 0,
          adjustedRating: 4.425,
        },
      ];
      const expectedResponse = [
        { isLoading: true, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        { selectedGenres: ['Parenting'], type: 'SELECTED_GENRES' },
        { isLoading: false, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        {
          bookshelf: [
            {
              __v: 0,
              _id: '5c959505494f5dd029aeff74',
              adjustedRating: 4.425,
              amazonAverageRating: 4.6,
              amazonRatingsCount: 29,
              categories: ['Religion'],
              description:
                'Elizabeth George, bestselling author and mother of two daughters',
              goodreadsAverageRating: 4.25,
              goodreadsRatingsCount: 149,
              isbn: '9780736917728',
              owned: false,
              price: '',
              read: false,
              subtitle: '',
              thumbnail:
                'http://books.google.com/books/content?id=K_AhmQEACAAJ&pr',
              title: "Raising a Daughter After God's Own Heart",
            },
          ],
          type: 'FETCH_BOOKSHELF_SUCCESS',
        },
        { error: null, hasErrored: false, type: 'FETCH_BOOKSHELF_HAS_ERRORED' },
        { genres: ['Religion'], type: 'FETCH_BOOKSHELF_GENRES_SUCCESS' },
      ];

      getBookshelfService.mockResolvedValue(bookshelf);
      getGenresBookshelfService.mockResolvedValue(bookshelf[0].categories);

      return store.dispatch(actions.getBookshelf(['Parenting'])).then(() => {
        expect(store.getActions()).toEqual(expectedResponse);
      });
    });
    it('getBookshelfService failed', () => {
      const store = createMockStore();
      const expectedResponse = [
        { isLoading: true, type: types.FETCH_BOOKSHELF_IS_LOADING },
        { isLoading: false, type: types.FETCH_BOOKSHELF_IS_LOADING },
        {
          error: 'err',
          hasErrored: true,
          type: types.FETCH_BOOKSHELF_HAS_ERRORED,
        },
      ];
      getBookshelfService.mockRejectedValue('err');

      return store.dispatch(actions.getBookshelf(['Parenting'])).then(() => {
        expect(store.getActions()).toEqual(expectedResponse);
      });
    });
  });

  it('addBookToBookshelfFailure', () => {
    const action = actions.addBookToBookshelfFailure('err');
    expect(action).toEqual({
      type: types.ADD_BOOK_TO_BOOKSHELF_FAILURE,
      error: 'err',
    });
  });
  it('addBookToBookshelfSuccess', () => {
    const action = actions.addBookToBookshelfSuccess(booklist);
    expect(action).toEqual({
      booklist,
      type: types.ADD_BOOK_TO_BOOKSHELF_SUCCESS,
    });
  });
  describe('addBookToBookshelf', () => {
    it('successful', () => {
      const bookshelf = [
        {
          categories: ['Juvenile Fiction'],
          read: false,
          owned: false,
          _id: '5c9d6b89f2ae7a3690d6fa42',
          amazonAverageRating: 4.7,
          amazonRatingsCount: 1916,
          price: '',
          isbn: '9780064404990',
          title: 'Year of the Griffin',
          subtitle: '',
          description:
            'It is eight years after the tours from offworld have stopped.',
          thumbnail: 'http://books.google.com/books/content?id=zCe6gRHonZg',
          goodreadsAverageRating: 4.21,
          goodreadsRatingsCount: 1860678,
          __v: 0,
          adjustedRating: 4.449916512838346,
        },
        booklist[0],
      ];
      const store = createMockStore();
      const expectedResponse = [
        { booklist: [], type: 'ADD_BOOK_TO_BOOKSHELF_SUCCESS' },
        { isLoading: true, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        { selectedGenres: [], type: 'SELECTED_GENRES' },
        { isLoading: false, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        {
          bookshelf: [
            {
              __v: 0,
              _id: '5c9d6b89f2ae7a3690d6fa42',
              adjustedRating: 4.449916512838346,
              amazonAverageRating: 4.7,
              amazonRatingsCount: 1916,
              categories: ['Juvenile Fiction'],
              description:
                'It is eight years after the tours from offworld have stopped.',
              goodreadsAverageRating: 4.21,
              goodreadsRatingsCount: 1860678,
              isbn: '9780064404990',
              owned: false,
              price: '',
              read: false,
              subtitle: '',
              thumbnail: 'http://books.google.com/books/content?id=zCe6gRHonZg',
              title: 'Year of the Griffin',
            },
            {
              amazonAverageRating: 4.6,
              amazonRatingsCount: 29,
              categories: ['Religion'],
              description:
                'Elizabeth George, bestselling author and mother of two daughters',
              goodreadsAverageRating: 4.25,
              goodreadsRatingsCount: 149,
              isbn: '9780736917728',
              price: '',
              subtitle: '',
              thumbnail:
                'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover',
              title: "Raising a Daughter After God's Own Heart",
            },
          ],
          type: 'FETCH_BOOKSHELF_SUCCESS',
        },
        { error: null, hasErrored: false, type: 'FETCH_BOOKSHELF_HAS_ERRORED' },
        {
          genres: ['Juvenile Fiction', 'Religion'],
          type: 'FETCH_BOOKSHELF_GENRES_SUCCESS',
        },
      ];
      addBookshelfService.mockResolvedValue(booklist);
      getBookshelfService.mockResolvedValue(bookshelf);
      getGenresBookshelfService.mockResolvedValue([
        bookshelf[0].categories[0],
        bookshelf[1].categories[0],
      ]);

      return store.dispatch(actions.addBookToBookshelf(booklist)).then(() => {
        expect(store.getActions()).toEqual(expectedResponse);
      });
    });
    it('failed', () => {
      const store = createMockStore();
      const expectedResponse = [
        { error: 'err', type: types.ADD_BOOK_TO_BOOKSHELF_FAILURE },
      ];
      addBookshelfService.mockRejectedValue('err');

      return store.dispatch(actions.addBookToBookshelf(booklist)).then(() => {
        expect(store.getActions()).toEqual(expectedResponse);
      });
    });
  });
  it('updateBookOnBookshelfSuccess', () => {
    const action = actions.updateBookOnBookshelfSuccess();
    expect(action).toEqual({
      type: types.UPDATE_BOOK_ON_BOOKSHELF_SUCCESS,
    });
  });
  it('updateBookOnBookshelfFailure', () => {
    const action = actions.updateBookOnBookshelfFailure('err');
    expect(action).toEqual({
      type: types.UPDATE_BOOK_ON_BOOKSHELF_FAILURE,
      error: 'err',
    });
  });
  describe('updateBookOnBookshelf', () => {
    it('successful without categories field', () => {
      const store = createMockStore();
      const expectedResponse = [
        { type: types.UPDATE_BOOK_ON_BOOKSHELF_SUCCESS },
      ];
      updateBookOnBookshelfService.mockResolvedValue({
        n: 1,
        nModified: 1,
        ok: 1,
      });

      return store
        .dispatch(
          actions.updateBookOnBookshelf('5c967fbcbfb8c4eb4b9d463c', {
            goodreadsRatingsCount: 21560,
          })
        )
        .then(() => {
          expect(store.getActions()).toEqual(expectedResponse);
        });
    });
    it('successful with categories field', () => {
      const store = createMockStore();
      const expectedResponse = [
        { type: 'UPDATE_BOOK_ON_BOOKSHELF_SUCCESS' },
        { isLoading: true, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        { selectedGenres: [], type: 'SELECTED_GENRES' },
        { isLoading: false, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        {
          bookshelf: [
            {
              __v: 0,
              _id: '5c9d6b89f2ae7a3690d6fa42',
              adjustedRating: 4.449916512838346,
              amazonAverageRating: 4.7,
              amazonRatingsCount: 1916,
              categories: ['Juvenile Fiction'],
              description:
                'It is eight years after the tours from offworld have stopped.',
              goodreadsAverageRating: 4.21,
              goodreadsRatingsCount: 1860678,
              isbn: '9780064404990',
              owned: false,
              price: '',
              read: false,
              subtitle: '',
              thumbnail: 'http://books.google.com/books/content?id=zCe6gRHonZg',
              title: 'Year of the Griffin',
            },
            {
              amazonAverageRating: 4.6,
              amazonRatingsCount: 29,
              categories: ['Religion'],
              description:
                'Elizabeth George, bestselling author and mother of two daughters',
              goodreadsAverageRating: 4.25,
              goodreadsRatingsCount: 149,
              isbn: '9780736917728',
              price: '',
              subtitle: '',
              thumbnail:
                'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover',
              title: "Raising a Daughter After God's Own Heart",
            },
          ],
          type: 'FETCH_BOOKSHELF_SUCCESS',
        },
        { error: null, hasErrored: false, type: 'FETCH_BOOKSHELF_HAS_ERRORED' },
        {
          genres: ['Juvenile Fiction', 'Religion'],
          type: 'FETCH_BOOKSHELF_GENRES_SUCCESS',
        },
      ];

      updateBookOnBookshelfService.mockResolvedValue({
        n: 1,
        nModified: 1,
        ok: 1,
      });

      return store
        .dispatch(
          actions.updateBookOnBookshelf('5c967fbcbfb8c4eb4b9d463c', {
            goodreadsRatingsCount: 21560,
            categories: ['Juvenile Fiction'],
          })
        )
        .then(() => {
          expect(store.getActions()).toEqual(expectedResponse);
        });
    });
    it('calls getBookshelf on refreshBookshelf', () => {
      const store = createMockStore();
      const expectedResponse = [{ type: 'UPDATE_BOOK_ON_BOOKSHELF_SUCCESS' }];
      updateBookOnBookshelfService.mockResolvedValue({
        n: 1,
        nModified: 1,
        ok: 1,
      });

      return store
        .dispatch(
          actions.updateBookOnBookshelf(
            '5c967fbcbfb8c4eb4b9d463c',
            {
              goodreadsRatingsCount: 21560,
            },
            true
          )
        )
        .then(() => {
          expect(store.getActions()).toEqual(expectedResponse);
        });
    });
    it('fails', () => {
      const store = createMockStore();
      const expectedResponse = [
        { error: 'err', type: types.UPDATE_BOOK_ON_BOOKSHELF_FAILURE },
      ];
      updateBookOnBookshelfService.mockRejectedValue(expectedResponse[0].error);

      return store
        .dispatch(
          actions.updateBookOnBookshelf('5c967fbcbfb8c4eb4b9d463c', {
            goodreadsRatingsCount: 21560,
          })
        )
        .then(() => {
          expect(store.getActions()).toEqual(expectedResponse);
        });
    });
  });
  it('deleteBookOnBookshelfSuccess', () => {
    const action = actions.deleteBookOnBookshelfSuccess(123);
    expect(action).toEqual({
      type: types.DELETE_BOOK_ON_BOOKSHELF_SUCCESS,
      deleteId: 123,
    });
  });
  it('deleteBookOnBookshelfFailure', () => {
    const action = actions.deleteBookOnBookshelfFailure('err');
    expect(action).toEqual({
      type: types.DELETE_BOOK_ON_BOOKSHELF_FAILURE,
      error: 'err',
    });
  });
  describe('deleteBookOnBookshelf', () => {
    it('successful', () => {
      const store = createMockStore();
      const expectedResponse = [
        {
          deleteId: '5c967fbcbfb8c4eb4b9d463c',
          type: 'DELETE_BOOK_ON_BOOKSHELF_SUCCESS',
        },
        { isLoading: true, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        { selectedGenres: [], type: 'SELECTED_GENRES' },
        { isLoading: false, type: 'FETCH_BOOKSHELF_IS_LOADING' },
        {
          bookshelf: [
            {
              __v: 0,
              _id: '5c9d6b89f2ae7a3690d6fa42',
              adjustedRating: 4.449916512838346,
              amazonAverageRating: 4.7,
              amazonRatingsCount: 1916,
              categories: ['Juvenile Fiction'],
              description:
                'It is eight years after the tours from offworld have stopped.',
              goodreadsAverageRating: 4.21,
              goodreadsRatingsCount: 1860678,
              isbn: '9780064404990',
              owned: false,
              price: '',
              read: false,
              subtitle: '',
              thumbnail: 'http://books.google.com/books/content?id=zCe6gRHonZg',
              title: 'Year of the Griffin',
            },
            {
              amazonAverageRating: 4.6,
              amazonRatingsCount: 29,
              categories: ['Religion'],
              description:
                'Elizabeth George, bestselling author and mother of two daughters',
              goodreadsAverageRating: 4.25,
              goodreadsRatingsCount: 149,
              isbn: '9780736917728',
              price: '',
              subtitle: '',
              thumbnail:
                'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover',
              title: "Raising a Daughter After God's Own Heart",
            },
          ],
          type: 'FETCH_BOOKSHELF_SUCCESS',
        },
        { error: null, hasErrored: false, type: 'FETCH_BOOKSHELF_HAS_ERRORED' },
        { genres: ['Religion'], type: 'FETCH_BOOKSHELF_GENRES_SUCCESS' },
      ];
      deleteBookOnBookshelfService.mockResolvedValue(booklist[0]);
      getGenresBookshelfService.mockResolvedValue(booklist[0].categories);

      return store
        .dispatch(actions.deleteBookOnBookshelf('5c967fbcbfb8c4eb4b9d463c'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedResponse);
        });
    });
    it('failed', () => {
      const store = createMockStore();
      const expectedResponse = [
        { error: 'err', type: types.DELETE_BOOK_ON_BOOKSHELF_FAILURE },
      ];
      deleteBookOnBookshelfService.mockRejectedValue(expectedResponse[0].error);

      return store
        .dispatch(actions.deleteBookOnBookshelf('5c967fbcbfb8c4eb4b9d463c'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedResponse);
        });
    });
  });
  describe('getBookshelfGenres', () => {
    it('successful', () => {
      const store = createMockStore();
      const expectedResponse = [
        {
          genres: ['Genre1', 'Genre2'],
          type: types.FETCH_BOOKSHELF_GENRES_SUCCESS,
        },
      ];
      getGenresBookshelfService.mockResolvedValue(['Genre1', 'Genre2']);

      return store.dispatch(actions.getBookshelfGenres()).then(() => {
        expect(store.getActions()).toEqual(expectedResponse);
      });
    });
    it('failed', () => {
      const store = createMockStore();
      const expectedResponse = [
        { error: 'err', type: types.FETCH_BOOKSHELF_GENRES_FAILURE },
      ];
      getGenresBookshelfService.mockRejectedValue(expectedResponse[0].error);

      return store.dispatch(actions.getBookshelfGenres()).then(() => {
        expect(store.getActions()).toEqual(expectedResponse);
      });
    });
  });
  it('deleteModifiedBookFromBooklist', () => {
    const action = actions.deleteModifiedBookFromBooklist('12345');
    expect(action).toEqual({
      type: types.DELETE_BOOK_FROM_BOOKLIST_SUCCESS,
      deleteISBN: '12345',
    });
  });
  it('deleteModifiedBook', () => {
    const dispatch = jest.fn();
    actions.deleteModifiedBook('12345')(dispatch);
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  it('getBookshelfGenresFailure', () => {
    const action = actions.getBookshelfGenresFailure('err');
    expect(action).toEqual({
      type: types.FETCH_BOOKSHELF_GENRES_FAILURE,
      error: 'err',
    });
  });
  it('can clearBooks', () => {
    const dispatch = jest.fn();
    actions.clearBooks()(dispatch);
    expect(dispatch.mock.calls).toMatchSnapshot();
  });
});
