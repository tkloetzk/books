import * as types from './goodreadsActionTypes';
import {
  getGoodreadsBooksService,
  getGoodreadsSingleBooksService,
} from '../../services/goodreadsService';
import sortBooklist from '../bookshelf/bookshelfActions';

export function getGoodreadsBookFailure(bool) {
  return {
    type: types.FETCH_GOODREADS_BOOK_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function getGoodreadsBookIsLoading(bool) {
  return {
    type: types.FETCH_GOODREADS_BOOK_IS_LOADING,
    isLoading: bool,
  };
}

export function getGoodreadsBooksSuccess(booklist) {
  return {
    type: types.FETCH_GOODREADS_BOOKS_SUCCESS,
    booklist,
  };
}

export function getGoodreadsBooks(booklist) {
  return dispatch => {
    dispatch(getGoodreadsBookIsLoading(true));
    return getGoodreadsBooksService(booklist)
      .then(resp => {
        dispatch(getGoodreadsBookIsLoading(false));
        const sortedResp = sortBooklist(resp);
        console.log('sorted', sortedResp);
        // dispatch(getGoodreadsBooksSuccess(resp));
      })
      .catch(error => {
        dispatch(getGoodreadsBookIsLoading(false));
        dispatch(getGoodreadsBookFailure(true));
      });
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
    dispatch(getGoodreadsBookIsLoading(true));
    return getGoodreadsSingleBooksService(isbn)
      .then(resp => {
        dispatch(getGoodreadsBookIsLoading(false));
        dispatch(getGoodreadsBookSuccess(resp));
      })
      .catch(error => {
        dispatch(getGoodreadsBookIsLoading(false));
        dispatch(getGoodreadsBookFailure(true));
      });
  };
}
