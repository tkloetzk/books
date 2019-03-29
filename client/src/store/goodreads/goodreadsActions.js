import * as types from './goodreadsActionTypes';
import { getGoodreadsSingleBooksService } from '../../services/goodreadsService';
import { LOADING_STATUSES } from '../../util/constants';

export function getGoodreadsBookFailure(bool, error) {
  return {
    type: types.FETCH_GOODREADS_BOOK_HAS_ERRORED,
    hasErrored: bool,
    error,
  };
}

export function getGoodreadsBookIsLoading(status) {
  return {
    type: types.FETCH_GOODREADS_BOOK_IS_LOADING,
    isLoading: status,
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
        dispatch(getGoodreadsBookFailure(false, null));
      })
      .catch(error => {
        dispatch(getGoodreadsBookIsLoading(LOADING_STATUSES.errored));
        dispatch(getGoodreadsBookFailure(true, error));
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
