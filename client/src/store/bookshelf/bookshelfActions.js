import {
  addBookshelfService,
  getBookshelfService,
  updateBookOnBookshelfService,
} from '../../services/bookshelfService';
import * as types from './bookshelfActionTypes';
import remove from 'lodash/remove';

export function getBookshelfIsLoading(bool) {
  return {
    type: types.FETCH_BOOKSHELF_IS_LOADING,
    isLoading: bool,
  };
}

export function getBookshelfSuccess(bookshelf) {
  return {
    type: types.FETCH_BOOKSHELF_SUCCESS,
    bookshelf,
  };
}

export function getBookshelfFailure(bool) {
  return {
    type: types.FETCH_BOOKSHELF_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function saveCombinedBooksSuccess(booklist) {
  return {
    type: types.SAVE_COMBINED_BOOKS_SUCCESS,
    booklist,
  };
}

export function saveCombinedBooks(books) {
  return dispatch => {
    dispatch(saveCombinedBooksSuccess(books));
  };
}

export function saveModifiedBooksSuccess(modifiedBooklist) {
  return {
    type: types.SAVE_MODIFIED_BOOKS_SUCCESS,
    modifiedBooklist,
  };
}

export function saveModifiedBooks(books) {
  return dispatch => {
    dispatch(saveModifiedBooksSuccess(books));
  };
}
export function getBookshelf(excludeGenre = []) {
  return dispatch => {
    dispatch(getBookshelfIsLoading(true));
    return getBookshelfService(excludeGenre)
      .then(bookshelf => {
        dispatch(getBookshelfIsLoading(false));
        dispatch(getBookshelfSuccess(bookshelf));
        return bookshelf;
      })
      .catch(error => {
        dispatch(getBookshelfIsLoading(false));
        dispatch(getBookshelfFailure(true));
        console.error('bookshelf error', error);
      });
  };
}

export function addBookToBookshelfSuccess(booklist) {
  return {
    type: types.ADD_BOOK_TO_BOOKSHELF_SUCCESS,
    booklist,
  };
}
export function addBookToBookshelfFailure(error) {
  return {
    type: types.ADD_BOOK_TO_BOOKSHELF_FAILURE,
    error,
  };
}

export function addBookToBookshelf(booklist) {
  return dispatch => {
    return addBookshelfService(booklist)
      .then(saved => {
        const remainingbooklist = remove(saved, obj =>
          booklist.includes(obj.isbn)
        );
        dispatch(addBookToBookshelfSuccess(remainingbooklist));
        return true;
      })
      .catch(error => {
        dispatch(addBookToBookshelfFailure(error));
        console.log('error', error);
      });
  };
}

export function updateBookOnBookshelfSuccess(modifiedBooklist) {
  return {
    type: types.UPDATE_BOOK_ON_BOOKSHELF_SUCCESS,
    modifiedBooklist,
  };
}
export function updateBookOnBookshelfFailure(error) {
  return {
    type: types.UPDATE_BOOK_ON_BOOKSHELF_FAILURE,
    error,
  };
}
export function updateBookOnBookshelf(id, fields) {
  return dispatch => {
    return updateBookOnBookshelfService(id, fields)
      .then(saved => {
        dispatch(updateBookOnBookshelfSuccess([]));
      })
      .catch(error => {
        dispatch(updateBookOnBookshelfFailure(error));
        console.log('error', error);
      });
  };
}
