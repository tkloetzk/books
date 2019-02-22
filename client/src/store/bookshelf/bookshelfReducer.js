import * as types from './bookshelfActionTypes';

const initialState = {
  hasErrored: null,
  bookshelf: [],
  savedBooklist: [],
};

export default function bookshelf(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_BOOKSHELF_SUCCESS:
      return Object.assign({}, state, {
        bookshelf: action.bookshelf,
      });
    case types.FETCH_BOOKSHELF_HAS_ERRORED:
      return Object.assign({}, state, {
        hasErrored: action.hasErrored,
      });
    case types.SAVE_COMBINED_BOOKS_SUCESS:
      return Object.assign({}, state, {
        booklist: action.booklist,
      });
    case types.ADD_BOOK_TO_BOOKSHELF_SUCCESS: {
      return Object.assign({}, state, {
        savedBooklist: action.booklist,
      });
    }
    default:
      return state;
  }
}
