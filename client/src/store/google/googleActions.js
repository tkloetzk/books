import * as types from './googleActionTypes';
import { getGoogleBookService } from '../../services/googleService';
import { LOADING_STATUSES } from '../../util/constants';

export function getGoogleBookFailure(bool) {
  return {
    type: types.FETCH_GOOGLE_BOOK_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function getGoogleBookIsLoading(status) {
  return {
    type: types.FETCH_GOOGLE_BOOK_IS_LOADING,
    isLoading: status,
  };
}

export function getGoogleBookSuccess(book) {
  return {
    type: types.FETCH_GOOGLE_BOOK_SUCCESS,
    book,
  };
}

export function getGoogleBook(isbn) {
  return dispatch => {
    dispatch(getGoogleBookIsLoading(LOADING_STATUSES.loading));
    return getGoogleBookService(isbn)
      .then(resp => {
        dispatch(getGoogleBookIsLoading(LOADING_STATUSES.success));
        dispatch(getGoogleBookSuccess(resp));
      })
      .catch(error => {
        dispatch(getGoogleBookIsLoading(LOADING_STATUSES.errored));
        dispatch(getGoogleBookFailure(true));
      });
  };
}

export function clearGoogleBooksSuccess() {
  return {
    type: types.CLEAR_GOOGLE_BOOKS_SUCCESS,
  };
}

export function clearGoogleBooks() {
  return dispatch => {
    dispatch(clearGoogleBooksSuccess());
  };
}
