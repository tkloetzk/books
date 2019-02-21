import * as types from './googleActionTypes';
import { getGoogleBookService } from '../../services/googleService';

export function getGoogleBookFailure(bool) {
  return {
    type: types.FETCH_GOOGLE_BOOK_HAS_ERRORED,
    hasErrored: bool,
  };
}

export function getGoogleBookIsLoading(bool) {
  return {
    type: types.FETCH_GOOGLE_BOOK_IS_LOADING,
    isLoading: bool,
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
    dispatch(getGoogleBookIsLoading(true));
    return getGoogleBookService(isbn)
      .then(resp => {
        dispatch(getGoogleBookIsLoading(false));
        dispatch(getGoogleBookSuccess(resp));
      })
      .catch(error => {
        dispatch(getGoogleBookIsLoading(false));
        dispatch(getGoogleBookFailure(true));
      });
  };
}
