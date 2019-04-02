import {
  addBookshelfService,
  getBookshelfService,
  deleteBookOnBookshelfService,
  updateBookOnBookshelfService,
} from '../../services/bookshelfService';
import * as types from './bookshelfActionTypes';
import remove from 'lodash/remove';
import { clearAmazonBooks } from '../amazon/amazonActions';
import { clearGoodreadsBooks } from '../goodreads/goodreadsActions';
import { clearGoogleBooks } from '../google/googleActions';

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

export function getBookshelfFailure(bool, error) {
  return {
    type: types.FETCH_BOOKSHELF_HAS_ERRORED,
    hasErrored: bool,
    error,
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

export function insertModifiedBookSuccess(modifiedBook) {
  return {
    type: types.INSERT_MODIFIED_BOOK_SUCCESS,
    modifiedBook,
  };
}

export function insertModifiedBook(book) {
  return dispatch => {
    dispatch(insertModifiedBookSuccess(book));
  };
}

export function filterBookshelf(filters) {
  return {
    type: types.FILTER_BOOKSHELF_SUCCESS,
    filters,
  };
}
export function getBookshelf(includedGenres = []) {
  return dispatch => {
    dispatch(getBookshelfIsLoading(true));

    // If false, means no genres are selected so return nothing
    if (includedGenres === false) {
      dispatch(getBookshelfIsLoading(false));
      dispatch(getBookshelfSuccess([]));
      return [];
    } else {
      return getBookshelfService(includedGenres)
        .then(bookshelf => {
          dispatch(getBookshelfIsLoading(false));
          dispatch(getBookshelfSuccess(bookshelf));
          dispatch(getBookshelfFailure(false, null));
          return bookshelf;
        })
        .catch(error => {
          dispatch(getBookshelfIsLoading(false));
          dispatch(getBookshelfFailure(true, error));
          console.error('bookshelf error', error);
        });
    }
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
        dispatch(getBookshelf());
        return true;
      })
      .catch(error => {
        dispatch(addBookToBookshelfFailure(error));
        console.error('error 121', error);
      });
  };
}

export function updateBookOnBookshelfSuccess() {
  return {
    type: types.UPDATE_BOOK_ON_BOOKSHELF_SUCCESS,
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
        dispatch(updateBookOnBookshelfSuccess());
        // dispatch(getBookshelf());
      })
      .catch(error => {
        dispatch(updateBookOnBookshelfFailure(error));
        console.error('error', error);
      });
  };
}

export function deleteBookOnBookshelfSuccess(deleteId) {
  return {
    type: types.DELETE_BOOK_ON_BOOKSHELF_SUCCESS,
    deleteId,
  };
}
export function deleteBookOnBookshelfFailure(error) {
  return {
    type: types.DELETE_BOOK_ON_BOOKSHELF_FAILURE,
    error,
  };
}

export function deleteBookOnBookshelf(id) {
  return dispatch => {
    return deleteBookOnBookshelfService(id)
      .then(book => {
        dispatch(deleteBookOnBookshelfSuccess(id));
        dispatch(getBookshelf());
      })
      .catch(error => {
        dispatch(deleteBookOnBookshelfFailure(error));
        console.error('error', error);
      });
  };
}

export function deleteModifiedBookFromBooklist(deleteISBN) {
  return {
    type: types.DELETE_BOOK_FROM_BOOKLIST_SUCCESS,
    deleteISBN,
  };
}

export function deleteModifiedBook(isbn) {
  return dispatch => {
    return dispatch(deleteModifiedBookFromBooklist(isbn));
  };
}
export function clearBooks() {
  return dispatch => {
    dispatch(clearAmazonBooks());
    dispatch(clearGoodreadsBooks());
    dispatch(clearGoogleBooks());
  };
}
