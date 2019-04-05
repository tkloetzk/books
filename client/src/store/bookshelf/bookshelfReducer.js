import * as types from './bookshelfActionTypes';
import { LOADING_STATUSES } from '../../util/constants';
import some from 'lodash/some';
import remove from 'lodash/remove';

export const initialState = {
  hasErrored: null,
  deletion: false,
  bookshelf: [],
  booklist: [],
  modifiedBooklist: [],
  error: null,
  saveStatus: { status: LOADING_STATUSES.initial, message: '' },
  refreshed: false,
  filters: [],
  genres: [],
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
        error: action.error,
      });
    case types.FILTER_BOOKSHELF_SUCCESS:
      return Object.assign({}, state, {
        filters: action.filters,
      });
    case types.SAVE_COMBINED_BOOKS_SUCCESS:
      return Object.assign({}, state, {
        booklist: [...state.booklist, ...action.booklist], // TODO: Do i need to array and deconstructing?
      });
    case types.SAVE_MODIFIED_BOOKS_SUCCESS:
      return Object.assign({}, state, {
        modifiedBooklist: action.modifiedBooklist,
      });
    case types.INSERT_MODIFIED_BOOK_SUCCESS:
      const { modifiedBook } = action;
      const { modifiedBooklist } = state;

      var exisiting = some(
        modifiedBooklist,
        book => book.isbn === modifiedBook.isbn
      );

      if (exisiting) {
        const newModifiedBooklist = modifiedBooklist.map(book => {
          if (book.isbn === modifiedBook.isbn)
            return Object.assign({}, book, modifiedBook);
          return book;
        });
        return Object.assign({}, state, {
          modifiedBooklist: newModifiedBooklist,
        });
      }

      remove(state.booklist, book => book.isbn === modifiedBook.isbn);
      return Object.assign({}, state, {
        booklist: [...state.booklist, modifiedBook],
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
        modifiedBooklist: initialState.modifiedBooklist,
        deletion: false,
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
    case types.DELETE_BOOK_ON_BOOKSHELF_SUCCESS: {
      remove(state.bookshelf, book => book._id === action.deleteId); // TODO: What is this doing?
      return Object.assign({}, state, {
        bookshelf: [...state.bookshelf],
      });
    }
    case types.DELETE_BOOK_FROM_BOOKLIST_SUCCESS: {
      remove(state.booklist, book => book.isbn === action.deleteISBN); // TODO: What is this doing?
      return Object.assign({}, state, {
        booklist: [...state.booklist],
      });
    }
    case types.FETCH_BOOKSHELF_GENRES_SUCCESS: {
      return Object.assign({}, state, {
        genres: action.genres
      })
    }
    case types.FETCH_BOOKSHELF_GENRES_FAILURE: {
      return Object.assign({}, state, {
        error: action.error
      })
    }
    default:
      return state;
  }
}
