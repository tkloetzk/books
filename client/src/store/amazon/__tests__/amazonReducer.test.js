import amazonReducer from '../amazonReducer';
import { initialState } from '../amazonReducer';
import * as types from '../amazonActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';

describe('amazon reducer', () => {
  let book;
  beforeEach(() => {
    book = {
      amazonAverageRating: 4.7,
      amazonRatingsCount: 1916,
      price: '',
      isbn: '9780064404990',
    };
  });
  it('should return inital state if type is not found and no state passed in', () => {
    const testState = amazonReducer(undefined, { type: 'FAKE' });
    expect(testState).toEqual(initialState);
  });
  it('should return given state if type is not found', () => {
    const expectedState = 'example state';
    const resultState = amazonReducer(expectedState, { type: 'FAKE' });
    expect(resultState).toBe(expectedState);
  });
  describe('FETCH_AMAZON_BOOK_SUCCESS', () => {
    it('can save book to empty books array', () => {
      const resultState = amazonReducer(initialState, {
        type: types.FETCH_AMAZON_BOOK_SUCCESS,
        book,
      });
      expect(resultState.books).toEqual([book]);
    });

    it('can save book to an exisiting books array', () => {
      const books = [
        {
          amazonAverageRating: 3.7,
          amazonRatingsCount: 16,
          price: '',
          isbn: '97800644043212',
        },
      ];
      const state = Object.assign({}, initialState, { books });
      const resultState = amazonReducer(state, {
        type: types.FETCH_AMAZON_BOOK_SUCCESS,
        book,
      });
      expect(resultState.books).toEqual([...books, book]);
    });
  });
  describe('FETCH_AMAZON_BOOK_HAS_ERRORED', () => {
    it('can set hasErrored state to true', () => {
      const state = amazonReducer(
        {},
        {
          type: types.FETCH_AMAZON_BOOK_HAS_ERRORED,
          hasErrored: true,
        }
      );
      expect(state.hasErrored).toEqual(true);
    });

    it('can set hasErrored state to true', () => {
      const state = amazonReducer(
        {},
        {
          type: types.FETCH_AMAZON_BOOK_HAS_ERRORED,
          hasErrored: false,
        }
      );
      expect(state.hasErrored).toEqual(false);
    });
  });
  describe('FETCH_AMAZON_BOOK_IS_LOADING', () => {
    it('can set isLoading state to loading', () => {
      const loadingState = amazonReducer(
        {},
        {
          type: types.FETCH_AMAZON_BOOK_IS_LOADING,
          isLoading: LOADING_STATUSES.loading,
        }
      );
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.loading);
    });

    it('can set isLoading state to success', () => {
      const loadingState = amazonReducer(
        {},
        {
          type: types.FETCH_AMAZON_BOOK_IS_LOADING,
          isLoading: LOADING_STATUSES.success,
        }
      );
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.success);
    });

    it('can set isLoading state to errored', () => {
      const loadingState = amazonReducer(
        {},
        {
          type: types.FETCH_AMAZON_BOOK_IS_LOADING,
          isLoading: LOADING_STATUSES.errored,
        }
      );
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.errored);
    });
  });
  describe('CLEAR_AMAZON_BOOKS_SUCCESS', () => {
    const state = Object.assign({}, initialState, { books: [book] });
    const resultState = amazonReducer(state, {
      type: types.CLEAR_AMAZON_BOOKS_SUCCESS,
    });
    expect(resultState).toEqual(initialState);
  });
});
