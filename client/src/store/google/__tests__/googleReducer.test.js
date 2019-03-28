import googleReducer from '../googleReducer';
import { initialState } from '../googleReducer';
import * as types from '../googleActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';

describe('google reducer', () => {
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
  it('should return inital state if type is not found and no state passed in', () => {
    const testState = googleReducer(undefined, { type: 'FAKE' });
    expect(testState).toEqual(initialState);
  })
  it('should return given state if type is not found', () => {
    const expectedState = 'example state';
    const resultState = googleReducer(expectedState, { type: 'FAKE' });
    expect(resultState).toBe(expectedState);
  })
  describe('FETCH_GOOGLE_BOOK_SUCCESS', () => {
    it('can save book to empty books array', () => {
      const resultState = googleReducer(initialState, {
        type: types.FETCH_GOOGLE_BOOK_SUCCESS,
        book,
      });
      expect(resultState.books).toEqual([book]);
    })
  
    it('can save book to an exisiting books array', () => {
      const books = [
        {
          title: 'Existing book',
          isbn: '12341234',
          subtitle: "Subtitle",
          description: 'Descritipn',
          thumbnail:
            'http://books.google.com/books/coover&img=1&zoom=1&edge=curl&source=gbs_api',
          categories: ['Test Cat'],
        }
      ]
      const state = Object.assign({}, initialState, { books });
      const resultState = googleReducer(state, {
        type: types.FETCH_GOOGLE_BOOK_SUCCESS,
        book,
      });
      expect(resultState.books).toEqual([...books, book]);
    })
  })
  describe('FETCH_GOOGLE_BOOK_HAS_ERRORED', () => {
    it('can set hasErrored state to true', () => {
      const hasErroredState = googleReducer({}, { 
        type: types.FETCH_GOOGLE_BOOK_HAS_ERRORED,
        hasErrored: true });
      expect(hasErroredState.hasErrored).toEqual(true);
    })

    it('can set hasErrored state to true', () => {
      const hasErroredState = googleReducer({}, { 
        type: types.FETCH_GOOGLE_BOOK_HAS_ERRORED,
        hasErrored: false });
      expect(hasErroredState.hasErrored).toEqual(false);
    })
  })

  describe('FETCH_GOOGLE_BOOK_IS_LOADING', () => {
    it('can set isLoading state to loading' , () => {
      const loadingState = googleReducer({}, { 
        type: types.FETCH_GOOGLE_BOOK_IS_LOADING,
        isLoading: LOADING_STATUSES.loading });
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.loading);
    })

    it('can set isLoading state to success' , () => {
      const loadingState = googleReducer({}, { 
        type: types.FETCH_GOOGLE_BOOK_IS_LOADING,
        isLoading: LOADING_STATUSES.success });
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.success);
    })

    it('can set isLoading state to errored' , () => {
      const loadingState = googleReducer({}, { 
        type: types.FETCH_GOOGLE_BOOK_IS_LOADING,
        isLoading: LOADING_STATUSES.errored });
      expect(loadingState.isLoading).toEqual(LOADING_STATUSES.errored);
    })
  })
  describe('CLEAR_GOOGLE_BOOKS_SUCCESS', () => {
    const books = [
      {
        title: 'Existing book',
        isbn: '12341234',
        subtitle: "Subtitle",
        description: 'Descritipn',
        thumbnail:
          'http://books.google.com/books/coover&img=1&zoom=1&edge=curl&source=gbs_api',
        categories: ['Test Cat'],
      }
    ]
    const state = Object.assign({}, initialState, { books });
    const resultState = googleReducer(state, {
      type: types.CLEAR_GOOGLE_BOOKS_SUCCESS,
    });
    expect(resultState).toEqual(initialState);
  })
})