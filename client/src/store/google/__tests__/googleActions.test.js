import * as actions from '../googleActions';
import * as types from '../googleActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';
import { getGoogleBookService } from '../../../services/googleService';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const createMockStore = configureMockStore([thunk]);

jest.mock('../../../services/googleService');

describe('google actions', () => {
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
    getGoogleBookService.mockClear();
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
  it('can clear google books', () => {
    const dispatch = jest.fn();
    actions.clearGoogleBooks()(dispatch);
    expect(dispatch.mock.calls).toMatchSnapshot();
  });
  it('can clear google books success', () => {
    const action = actions.clearGoogleBooksSuccess();
    expect(action).toEqual({
      type: types.CLEAR_GOOGLE_BOOKS_SUCCESS,
    });
  });
  it('can get google book', () => {
    const store = createMockStore();
    const response = {
      title: 'A Curve in the Road',
      isbn: '9781503904453',
      subtitle: '',
      description:
        'Abbie MacIntyre is living the dream in the picturesque Nova Scotia town she calls home. She is a successful surgeon, is married to a handsome cardiologist, and has a model teenage son who is only months away from going off to college. But then one fateful night, everything changes. When a drunk driver hits her car, Abbie is rushed to the hospital. She survives, but the accident forces unimaginable secrets out into the open and plagues Abbie with nightmares so vivid that she starts to question her grip on reality. Her perfect life begins to crack, and those cracks threaten to shatter her world completely. The search for answers will test her strength in every way—as a wife, a career woman, and a mother—but it may also open the door for Abbie to move forward, beyond anger and heartbreak, to find out what she is truly made of. In learning to heal and trust again, she may just find new hope in the spaces left behind.',
      thumbnail:
        'http://books.google.com/books/content?id=SPLJswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      categories: ['Drunk driving'],
    };
    const expectedResponse = [
      { isLoading: 'loading', type: 'FETCH_GOOGLE_BOOK_IS_LOADING' },
      { isLoading: 'success', type: 'FETCH_GOOGLE_BOOK_IS_LOADING' },
      {
        book: {
          categories: ['Drunk driving'],
          description:
            'Abbie MacIntyre is living the dream in the picturesque Nova Scotia town she calls home. She is a successful surgeon, is married to a handsome cardiologist, and has a model teenage son who is only months away from going off to college. But then one fateful night, everything changes. When a drunk driver hits her car, Abbie is rushed to the hospital. She survives, but the accident forces unimaginable secrets out into the open and plagues Abbie with nightmares so vivid that she starts to question her grip on reality. Her perfect life begins to crack, and those cracks threaten to shatter her world completely. The search for answers will test her strength in every way—as a wife, a career woman, and a mother—but it may also open the door for Abbie to move forward, beyond anger and heartbreak, to find out what she is truly made of. In learning to heal and trust again, she may just find new hope in the spaces left behind.',
          isbn: '9781503904453',
          subtitle: '',
          thumbnail:
            'http://books.google.com/books/content?id=SPLJswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          title: 'A Curve in the Road',
        },
        type: 'FETCH_GOOGLE_BOOK_SUCCESS',
      },
      {
        error: undefined,
        hasErrored: false,
        type: 'FETCH_GOOGLE_BOOK_HAS_ERRORED',
      },
    ];
    getGoogleBookService.mockResolvedValue(response);

    return store.dispatch(actions.getGoogleBook(book.isbn)).then(() => {
      expect(store.getActions()).toEqual(expectedResponse);
    });
  });
  it('can throw error on get google book', () => {
    const store = createMockStore();
    const response = null;
    const expectedResponse = [
      { isLoading: 'loading', type: 'FETCH_GOOGLE_BOOK_IS_LOADING' },
      { isLoading: 'errored', type: 'FETCH_GOOGLE_BOOK_IS_LOADING' },
      { error: null, hasErrored: true, type: 'FETCH_GOOGLE_BOOK_HAS_ERRORED' },
    ];
    getGoogleBookService.mockRejectedValue(response);

    return store.dispatch(actions.getGoogleBook(book.isbn)).then(() => {
      expect(store.getActions()).toEqual(expectedResponse);
    });
  });
});
