import * as types from './goodreadsActionTypes';
import {
  getGoodreadsSingleBooksService,
} from '../../services/goodreadsService';
import { LOADING_STATUSES } from '../../util/constants';

export function getGoodreadsBookFailure(bool) {
  return {
    type: types.FETCH_GOODREADS_BOOK_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function getGoodreadsBookIsLoading(status) {
  return {
    type: types.FETCH_GOODREADS_BOOK_IS_LOADING,
    isLoading: status,
  };
}

export function getGoodreadsBooksSuccess(booklist) {
  return {
    type: types.FETCH_GOODREADS_BOOKS_SUCCESS,
    booklist,
  };
}

export function getGoodreadsBookSuccess(book) {
  return {
    type: types.FETCH_GOODREADS_BOOK_SUCCESS,
    book,
  };
}

export function getGoodreadsBook(isbn) {
  return dispatch => {
    dispatch(getGoodreadsBookIsLoading(LOADING_STATUSES.loading));
    return getGoodreadsSingleBooksService(isbn)
      .then(resp => {
        dispatch(getGoodreadsBookIsLoading(LOADING_STATUSES.success));
        dispatch(getGoodreadsBookSuccess(resp));
      })
      .catch(error => {
        dispatch(getGoodreadsBookIsLoading(LOADING_STATUSES.errored));
        dispatch(getGoodreadsBookFailure(true));
      });
  };
}

export function clearGoodreadsBooksSuccess() {
  return {
    type: types.CLEAR_GOODREADS_BOOKS_SUCCESS,
  };
}
export function clearGoodreadsBooks() {
  return dispatch => {
    dispatch(clearGoodreadsBooksSuccess());
  };
}
