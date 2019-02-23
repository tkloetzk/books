import {
  addBookshelfService,
  getBookshelfService,
} from '../../services/bookshelfService';
import * as types from './bookshelfActionTypes';

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
    type: types.SAVE_COMBINED_BOOKS_SUCESS,
    booklist,
  };
}
export function saveCombinedBooks(books) {
  return dispatch => {
    dispatch(saveCombinedBooksSuccess(books));
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
export function addBookToBookshelf(booklist) {
  return dispatch => {
    return addBookshelfService(booklist)
      .then(resp => {
        dispatch(addBookToBookshelfSuccess(booklist));
        return true;
      })
      .catch(error => {
        console.log('error', error);
      });
  };
}
