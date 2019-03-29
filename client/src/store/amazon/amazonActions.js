import * as types from './amazonActionTypes';
import { LOADING_STATUSES } from '../../util/constants';
import { getAmazonBookService } from '../../services/amazonService';

export function getAmazonBookFailure(bool, error) {
  return {
    type: types.FETCH_AMAZON_BOOK_HAS_ERRORED,
    hasErrored: bool,
    error,
  };
}

export function getAmazonBookIsLoading(status) {
  return {
    type: types.FETCH_AMAZON_BOOK_IS_LOADING,
    isLoading: status,
  };
}

export function getAmazonBookSuccess(books) {
  return {
    type: types.FETCH_AMAZON_BOOK_SUCCESS,
    books,
  };
}

export function getSingleAmazonBookSuccess(book) {
  return {
    type: types.FETCH_AMAZON_BOOK_SUCCESS,
    book,
  };
}

export function getAmazonBook(isbn) {
  return dispatch => {
    dispatch(getAmazonBookIsLoading(LOADING_STATUSES.loading));
    return getAmazonBookService(isbn)
      .then(resp => {
        dispatch(getAmazonBookIsLoading(LOADING_STATUSES.success));
        dispatch(getSingleAmazonBookSuccess(resp.book));
        dispatch(getAmazonBookFailure(false, null));
      })
      .catch(error => {
        dispatch(getAmazonBookIsLoading(LOADING_STATUSES.errored));
        dispatch(getAmazonBookFailure(true, error));
      });
  };
}

export function clearAmazonBooksSuccess() {
  return {
    type: types.CLEAR_AMAZON_BOOKS_SUCCESS,
  };
}

export function clearAmazonBooks() {
  return dispatch => {
    return dispatch(clearAmazonBooksSuccess());
  };
}
