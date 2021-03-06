import * as types from './goodreadsActionTypes';
import { LOADING_STATUSES } from '../../util/constants';

export const initialState = {
  hasErrored: false,
  error: null,
  books: [],
  isLoading: LOADING_STATUSES.initial,
};

export default function goodreadsBookSearch(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_GOODREADS_BOOK_SUCCESS:
      return Object.assign({}, state, {
        books: [...state.books, action.book],
      });
    case types.FETCH_GOODREADS_BOOK_HAS_ERRORED:
      return Object.assign({}, state, {
        hasErrored: action.hasErrored,
        error: action.error,
      });
    case types.FETCH_GOODREADS_BOOK_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case types.CLEAR_GOODREADS_BOOKS_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
