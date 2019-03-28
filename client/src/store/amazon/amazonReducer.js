import * as types from './amazonActionTypes';
import { LOADING_STATUSES } from '../../util/constants';

const initialState = {
  hasErrored: null,
  books: [],
  isLoading: LOADING_STATUSES.initial,
};

export default function amazonBookSearch(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_AMAZON_BOOK_SUCCESS:
      return Object.assign({}, state, {
        books: [...state.books, action.book],
      });
    case types.FETCH_AMAZON_BOOK_HAS_ERRORED:
      return Object.assign({}, state, {
        hasErrored: action.hasErrored,
      });
    case types.FETCH_AMAZON_BOOK_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case types.CLEAR_AMAZON_BOOKS_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
