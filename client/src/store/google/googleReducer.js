import * as types from './googleActionTypes';

const initialState = {
  hasErrored: false,
  books: [],
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
      });
    default:
      return state;
  }
}
