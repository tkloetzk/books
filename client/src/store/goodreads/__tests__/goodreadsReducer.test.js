import goodreadsReducer from '../goodreadsReducer';
import { initialState } from '../goodreadsReducer';
import * as types from '../goodreadsActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';

describe('goodreads reducer', () => {
  let book;
  beforeEach(() => {
    book = {
      isbn: '9781400079094',
      goodreadsAverageRating: 4.41,
      goodreadsRatingsCount: 6440,
    };
  });
  it('should return inital state if type is not found and no state passed in', () => {
    const testState = goodreadsReducer(undefined, { type: 'FAKE' });
    expect(testState).toEqual(initialState);
  });
  it('should return given state if type is not found', () => {
    const expectedState = 'example state';
    const resultState = goodreadsReducer(expectedState, { type: 'FAKE' });
    expect(resultState).toBe(expectedState);
  });
  describe('FETCH_GOODREADS_BOOK_SUCCESS', () => {
    it('can save book to empty books array', () => {
      const resultState = goodreadsReducer(initialState, {
        type: types.FETCH_GOODREADS_BOOK_SUCCESS,
        book,
      });
      expect(resultState.books).toEqual([book]);
    });

    it('can save book to an exisiting books array', () => {
      const books = [
        {
          isbn: '12341234',
          goodreadsAverageRating: 3,
          goodreadsRatingsCount: 1234,
        },
      ];
      const state = Object.assign({}, initialState, { books });
      const resultState = goodreadsReducer(state, {
        type: types.FETCH_GOODREADS_BOOK_SUCCESS,
        book,
      });
      expect(resultState.books).toEqual([...books, book]);
    });
  });
  describe('FETCH_GOODREADS_BOOK_HAS_ERRORED', () => {
    it('can set hasErrored state to true', () => {
      const hasErroredState = goodreadsReducer(
        {},
        {
          type: types.FETCH_GOODREADS_BOOK_HAS_ERRORED,
          hasErrored: true,
        }
      );
      expect(hasErroredState.hasErrored).toEqual(true);
    });

    it('can set hasErrored state to true', () => {
      const hasErroredState = goodreadsReducer(
        {},
        {
          type: types.FETCH_GOODREADS_BOOK_HAS_ERRORED,
          hasErrored: false,
        }
      );
      expect(hasErroredState.hasErrored).toEqual(false);
    });
  });
  describe('FETCH_GOODREADS_BOOK_IS_LOADING', () => {
    it('can set isLoading state to loading', () => {
      const loadingState = goodreadsReducer(
        {},
        {
          type: types.FETCH_GOODREADS_BOOK_IS_LOADING,
          isLoading: LOADING_STATUSES.loading,
        }
      );
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.loading);
    });

    it('can set isLoading state to success', () => {
      const loadingState = goodreadsReducer(
        {},
        {
          type: types.FETCH_GOODREADS_BOOK_IS_LOADING,
          isLoading: LOADING_STATUSES.success,
        }
      );
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.success);
    });

    it('can set isLoading state to errored', () => {
      const loadingState = goodreadsReducer(
        {},
        {
          type: types.FETCH_GOODREADS_BOOK_IS_LOADING,
          isLoading: LOADING_STATUSES.errored,
        }
      );
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.errored);
    });
  });
  describe('CLEAR_GOODREADS_BOOKS_SUCCESS', () => {
    const books = [
      {
        isbn: '12341234',
        goodreadsAverageRating: 3,
        goodreadsRatingsCount: 1234,
      },
    ];
    const state = Object.assign({}, initialState, { books });
    const resultState = goodreadsReducer(state, {
      type: types.CLEAR_GOODREADS_BOOKS_SUCCESS,
    });
    expect(resultState).toEqual(initialState);
  });
});
