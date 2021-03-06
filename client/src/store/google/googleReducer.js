import * as types from './googleActionTypes';
import { LOADING_STATUSES } from '../../util/constants';

export const initialState = {
  hasErrored: false,
  books: [],
  error: null,
  isLoading: LOADING_STATUSES.initial,
};

export default function google(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_GOOGLE_BOOK_SUCCESS:
      return Object.assign({}, state, {
        books: [...state.books, action.book],
      });
    case types.FETCH_GOOGLE_BOOK_HAS_ERRORED:
      return Object.assign({}, state, {
        hasErrored: action.hasErrored,
        error: action.error,
      });
    case types.FETCH_GOOGLE_BOOK_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case types.CLEAR_GOOGLE_BOOKS_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
