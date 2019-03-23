import * as actions from '../googleActions';
import * as types from '../googleActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('bookshelf reducer', () => {
  let book;
  beforeEach(() => {
    book = {
      title: 'Operating Instructions',
      isbn: '9781400079094',
      subtitle: "A Journal Of My Son's First Year",
      description: 'A single mother and writer grappling alone',
      thumbnail:
        'http://books.google.com/books/content?id=MiKz2RreyecC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      categories: ['Family & Relationships'],
    };
  });
  it('can set google book hasErrored', () => {
    const actionTrue = actions.getGoogleBookFailure(true);
    expect(actionTrue).toEqual({
      type: types.FETCH_GOOGLE_BOOK_HAS_ERRORED,
      hasErrored: true,
    });

    const actionFalse = actions.getGoogleBookFailure(false);
    expect(actionFalse).toEqual({
      type: types.FETCH_GOOGLE_BOOK_HAS_ERRORED,
      hasErrored: false,
    });
  });
  it('can set google book isLoading', () => {
    const action = actions.getGoogleBookIsLoading(LOADING_STATUSES.initial);
    expect(action).toEqual({
      type: types.FETCH_GOOGLE_BOOK_IS_LOADING,
      isLoading: LOADING_STATUSES.initial,
    });
  });
  it('can set google book success', () => {
    const action = actions.getGoogleBookSuccess(book);
    expect(action).toEqual({
      type: types.FETCH_GOOGLE_BOOK_SUCCESS,
      book,
    });
  });
});
