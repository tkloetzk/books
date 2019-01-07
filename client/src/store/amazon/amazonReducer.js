import * as types from './amazonActionTypes';

const initialState = {
  hasErrored: null,
  books: [],
};

export default function amazonBookSearch(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_AMAZON_BOOK_SUCCESS:
      return Object.assign({}, state, {
        books: action.books,
      });
    case types.FETCH_AMAZON_BOOK_HAS_ERRORED:
      return Object.assign({}, state, {
        hasErrored: action.hasErrored,
      });
    default:
      return state;
  }
}
