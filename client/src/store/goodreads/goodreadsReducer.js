import * as types from './goodreadsActionTypes';

const initialState = {
  hasErrored: null,
  books: [],
  booklist: [],
};

export default function goodreadsBookSearch(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_GOODREADS_BOOK_SUCCESS:
      return Object.assign({}, state, {
        books: action.books,
      });
    case types.FETCH_GOODREADS_BOOKS_SUCCESS:
      return Object.assign({}, state, {
        booklist: action.booklist,
      });
    case types.FETCH_GOODREADS_BOOK_HAS_ERRORED:
      return Object.assign({}, state, {
        hasErrored: action.hasErrored,
      });
    default:
      return state;
  }
}
