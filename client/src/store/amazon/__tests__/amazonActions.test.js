import * as actions from '../amazonActions';
import * as types from '../amazonActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';
import { getAmazonBookServiceSingle } from '../../../services/amazonService';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const createMockStore = configureMockStore([thunk]);

jest.mock('../../../services/amazonService');

describe('amazon actions', () => {
  let book;
  beforeEach(() => {
    book = {
      amazonAverageRating: 4.4,
      amazonRatingsCount: 929,
      price: '',
      isbn: '9780547564654',
    };
    getAmazonBookServiceSingle.mockClear();
  });
  it('can set amazon book hasErrored', () => {
    const actionTrue = actions.getAmazonBookFailure(true);
    expect(actionTrue).toEqual({
      type: types.FETCH_AMAZON_BOOK_HAS_ERRORED,
      hasErrored: true,
    });

    const actionFalse = actions.getAmazonBookFailure(false);
    expect(actionFalse).toEqual({
      type: types.FETCH_AMAZON_BOOK_HAS_ERRORED,
      hasErrored: false,
    });
  });
  it('can set amazon book isLoading', () => {
    const action = actions.getAmazonBookIsLoading(LOADING_STATUSES.initial);
    expect(action).toEqual({
      type: types.FETCH_AMAZON_BOOK_IS_LOADING,
      isLoading: LOADING_STATUSES.initial,
    });
  });
  it('can set amazon book success', () => {
    const action = actions.getAmazonBookSuccess(book);
    expect(action).toEqual({
      type: types.FETCH_AMAZON_BOOK_SUCCESS,
      books: book,
    });
  });
  it('can clear amazon books', () => {
    const dispatch = jest.fn();
    actions.clearAmazonBooks()(dispatch);
    expect(dispatch.mock.calls).toMatchSnapshot();
  });
  it('can clear amazon books success', () => {
    const action = actions.clearAmazonBooksSuccess();
    expect(action).toEqual({
      type: types.CLEAR_AMAZON_BOOKS_SUCCESS,
    });
  });
  it('can get amazon book', () => {
    const store = createMockStore();
    const response = {
      book: {
        amazonAverageRating: 4.4,
        amazonRatingsCount: 929,
        price: '',
        isbn: '9780547564654',
      },
    };
    const expectedResponse = [
      { isLoading: 'loading', type: 'FETCH_AMAZON_BOOK_IS_LOADING' },
      { isLoading: 'success', type: 'FETCH_AMAZON_BOOK_IS_LOADING' },
      {
        book: {
          amazonAverageRating: 4.4,
          amazonRatingsCount: 929,
          isbn: '9780547564654',
          price: '',
        },
        type: 'FETCH_AMAZON_BOOK_SUCCESS',
      },
    ];
    getAmazonBookServiceSingle.mockResolvedValue(response);

    return store.dispatch(actions.getAmazonBook(book.isbn)).then(() => {
      expect(store.getActions()).toEqual(expectedResponse);
    });
  });
  it('can throw error on get amazon book', () => {
    const store = createMockStore();
    const response = null;
    const expectedResponse = [
      { isLoading: 'loading', type: 'FETCH_AMAZON_BOOK_IS_LOADING' },
      { isLoading: 'errored', type: 'FETCH_AMAZON_BOOK_IS_LOADING' },
      { hasErrored: true, type: 'FETCH_AMAZON_BOOK_HAS_ERRORED' },
    ];
    getAmazonBookServiceSingle.mockRejectedValue(response);

    return store.dispatch(actions.getAmazonBook(book.isbn)).then(() => {
      expect(store.getActions()).toEqual(expectedResponse);
    });
  });
});
