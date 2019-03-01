import * as types from './bookshelfActionTypes';
import { LOADING_STATUSES } from '../../util/constants';

const initialState = {
  hasErrored: null,
  bookshelf: [],
  booklist: [],
  modifiedBooklist: [],
  error: null,
  saveStatus: { status: LOADING_STATUSES.initial, message: '' },
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
    case types.SAVE_COMBINED_BOOKS_SUCCESS:
      return Object.assign({}, state, {
        booklist: [...action.booklist], // TODO: Do i need to array and deconstructing?
      });
    case types.SAVE_MODIFIED_BOOKS_SUCCESS:
      return Object.assign({}, state, {
        modifiedBooklist: action.modifiedBooklist,
      });
    case types.ADD_BOOK_TO_BOOKSHELF_SUCCESS: {
      return Object.assign({}, state, {
        booklist: action.booklist,
        saveStatus: {
          status: LOADING_STATUSES.success,
          message: 'Save Successful',
        },
      });
    }
    case types.UPDATE_BOOK_ON_BOOKSHELF_SUCCESS: {
      return Object.assign({}, state, {
        modifiedBooklist: action.modifiedBooklist,
        saveStatus: {
          status: LOADING_STATUSES.success,
          message: 'Save Successful',
        },
      });
    }
    case types.ADD_BOOK_TO_BOOKSHELF_FAILURE: {
      return Object.assign({}, state, {
        saveStatus: {
          status: LOADING_STATUSES.errored,
          message: 'Save Failed',
        },
      });
    }
    default:
      return state;
  }
}
