import * as types from './amazonActionTypes';
import {
  getAmazonBookService,
  getAmazonBookServiceSingle,
} from '../../services/amazonService';

export function getAmazonBookFailure(bool) {
  return {
    type: types.FETCH_AMAZON_BOOK_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function getAmazonBookIsLoading(bool) {
  return {
    type: types.FETCH_AMAZON_BOOK_IS_LOADING,
    isLoading: bool,
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
    type: types.FETCH_SINGLE_AMAZON_BOOK_SUCCESS,
    book,
  };
}

export function getAmazonBook(isbns) {
  return dispatch => {
    dispatch(getAmazonBookIsLoading(true));
    return getAmazonBookService(isbns)
      .then(resp => {
        dispatch(getAmazonBookIsLoading(false));
        dispatch(getAmazonBookSuccess(resp.books));
        return resp.books;
      })
      .catch(error => {
        dispatch(getAmazonBookIsLoading(false));
        dispatch(getAmazonBookFailure(true));
      });
  };
}

export function getAmazonSingleBook(isbn) {
  return dispatch => {
    dispatch(getAmazonBookIsLoading(true));
    return getAmazonBookServiceSingle(isbn)
      .then(resp => {
        dispatch(getAmazonBookIsLoading(false));
        dispatch(getSingleAmazonBookSuccess(resp.book));
        return resp.book;
      })
      .catch(error => {
        dispatch(getAmazonBookIsLoading(false));
        dispatch(getAmazonBookFailure(true));
      });
  };
}
