import * as actions from '../goodreadsActions';
import * as types from '../goodreadsActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';
import { getGoodreadsSingleBooksService } from '../../../services/goodreadsService';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const createMockStore = configureMockStore([thunk])

jest.mock('../../../services/goodreadsService')

describe('goodreads actions', () => {
  let book;
  beforeEach(() => {
    book = {
      isbn: '9781400079094',
      goodreadsAverageRating: 3.5,
      goodreadsRatingsCount: 90,
    };
    getGoodreadsSingleBooksService.mockClear()
  });
  it('can set goodreads book hasErrored', () => {
    const actionTrue = actions.getGoodreadsBookFailure(true);
    expect(actionTrue).toEqual({
      type: types.FETCH_GOODREADS_BOOK_HAS_ERRORED,
      hasErrored: true,
    });

    const actionFalse = actions.getGoodreadsBookFailure(false);
    expect(actionFalse).toEqual({
      type: types.FETCH_GOODREADS_BOOK_HAS_ERRORED,
      hasErrored: false,
    });
  })
  it('can set goodreads book isLoading', () => {
    const action = actions.getGoodreadsBookIsLoading(LOADING_STATUSES.initial);
    expect(action).toEqual({
      type: types.FETCH_GOODREADS_BOOK_IS_LOADING,
      isLoading: LOADING_STATUSES.initial,
    });
  });
  it('can set goodreads book success', () => {
    const action = actions.getGoodreadsBookSuccess(book);
    expect(action).toEqual({
      type: types.FETCH_GOODREADS_BOOK_SUCCESS,
      book,
    });
  });
  it('can clear goodreads books', () => {
    const dispatch = jest.fn()
    actions.clearGoodreadsBooks()(dispatch)
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
  it('can clear goodreads books success', () => {
    const action = actions.clearGoodreadsBooksSuccess()
    expect(action).toEqual({
      type: types.CLEAR_GOODREADS_BOOKS_SUCCESS,
    })
  })
  it('can get google book', () => {
   const store = createMockStore()
   const expectedResponse = [{"isLoading": "loading", "type": "FETCH_GOODREADS_BOOK_IS_LOADING"}, {"isLoading": "success", "type": "FETCH_GOODREADS_BOOK_IS_LOADING"}, {"book": {"goodreadsAverageRating": 3.5, "goodreadsRatingsCount": 90, "isbn": "9781400079094"}, "type": "FETCH_GOODREADS_BOOK_SUCCESS"}]
   getGoodreadsSingleBooksService.mockResolvedValue(book)

    return store.dispatch(actions.getGoodreadsBook(book.isbn)).then(() => {
      expect(store.getActions()).toEqual(expectedResponse)
    })
  })
  it('can throw error on get goodreads book', () => {
    const store = createMockStore()
    const expectedResponse = [{"isLoading": "loading", "type": "FETCH_GOODREADS_BOOK_IS_LOADING"}, {"isLoading": "errored", "type": "FETCH_GOODREADS_BOOK_IS_LOADING"}, {"hasErrored": true, "type": "FETCH_GOODREADS_BOOK_HAS_ERRORED"}]
    getGoodreadsSingleBooksService.mockRejectedValue(null)

    return store.dispatch(actions.getGoodreadsBook(book.isbn)).then(() => {
      expect(store.getActions()).toEqual(expectedResponse)
    })
  })
})
