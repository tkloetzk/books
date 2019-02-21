import * as types from './bookshelfActionTypes';

const initialState = {
  hasErrored: null,
  bookshelf: [],
};

export default function bookshelf(state = initialState, action) {
  console.log('action', action);
  switch (action.type) {
    case types.FETCH_BOOKSHELF_SUCCESS:
      return Object.assign({}, state, {
        bookshelf: action.bookshelf,
      });
    case types.FETCH_BOOKSHELF_HAS_ERRORED:
      return Object.assign({}, state, {
        hasErrored: action.hasErrored,
      });
    default:
      return state;
  }
}
