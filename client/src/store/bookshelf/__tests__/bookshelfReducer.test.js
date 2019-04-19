import bookshelfReducer from '../bookshelfReducer';
import { initialState } from '../bookshelfReducer';
import * as types from '../bookshelfActionTypes';
import { LOADING_STATUSES } from '../../../util/constants';

describe('bookshelf reducer', () => {
  it('should return inital state if type is not found and no state passed in', () => {
    const testState = bookshelfReducer(undefined, { type: 'FAKE' });
    expect(testState).toEqual(initialState);
  });
  it('should return given state if type is not found', () => {
    const expectedState = 'example state';
    const resultState = bookshelfReducer(expectedState, { type: 'FAKE' });
    expect(resultState).toBe(expectedState);
  });
  describe('SAVE_COMBINED_BOOKS_SUCCESS', () => {
    let booklist = [];
    beforeEach(() => {
      booklist = [
        {
          amazonAverageRating: 4.6,
          amazonRatingsCount: 29,
          price: '',
          isbn: '9780736917728',
          title: "Raising a Daughter After God's Own Heart",
          subtitle: '',
          description:
            'Elizabeth George, bestselling author and mother of two daughters',
          thumbnail:
            'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          categories: ['Religion'],
          goodreadsAverageRating: 4.25,
          goodreadsRatingsCount: 149,
        },
      ];
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('save combinedBook to empty booklist', () => {
      const resultState = bookshelfReducer(initialState, {
        type: types.SAVE_COMBINED_BOOKS_SUCCESS,
        booklist,
      });
      expect(resultState.booklist).toEqual(booklist);
    });
    it('save combinedBook to an exisiting booklist', () => {
      const book = [
        {
          amazonAverageRating: 4.4,
          amazonRatingsCount: 340,
          price: '',
          isbn: '9780310338130',
          title: 'Hands Free Mama',
          subtitle:
            'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
          description:
            '“Rachel Macy Stafford\'s post "The Day I Stopped Saying Hurry Up" was a true phenomenon on The Huffington Post, igniting countless',
          thumbnail:
            'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
          categories: ['Family & Relationships'],
          goodreadsAverageRating: 3.59,
          goodreadsRatingsCount: 3199,
        },
      ];
      const state = Object.assign({}, initialState, { booklist });
      const resultState = bookshelfReducer(state, {
        type: types.SAVE_COMBINED_BOOKS_SUCCESS,
        booklist: book,
      });
      expect(resultState.booklist).toEqual([...booklist, ...book]);
    });
  });
  describe('SAVE_MODIFIED_BOOKS_SUCCESS', () => {
    it('can save modified book into empty modifiedbooklist', () => {
      const modifiedBooklist = [
        {
          amazonAverageRating: null,
          amazonRatingsCount: null,
          price: '',
          isbn: '9780736917728',
          title: "Raising a Daughter After God's Own Heart",
          subtitle: '',
          description:
            'Elizabeth George, bestselling author and mother of two daughters',
          thumbnail:
            'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          categories: ['Religion'],
          goodreadsAverageRating: 4.25,
          goodreadsRatingsCount: 149,
          differences: [
            { key: 'amazonAverageRating', currentValue: 4.6, newValue: null },
            { key: 'amazonRatingsCount', currentValue: 29, newValue: null },
            {
              key: 'title',
              currentValue: "Raising a Daughter After God's Own Heart1",
              newValue: "Raising a Daughter After God's Own Heart",
            },
          ],
          _id: '5c959505494f5dd029aeff74',
        },
      ];
      const resultState = bookshelfReducer(initialState, {
        type: types.SAVE_MODIFIED_BOOKS_SUCCESS,
        modifiedBooklist,
      });
      expect(resultState.modifiedBooklist).toEqual(modifiedBooklist);
    });
  });
  describe('FETCH_BOOKSHELF', () => {
    it('sets bookshelf on FETCH_BOOKSHELF_SUCCESS', () => {
      const bookshelf = [
        {
          amazonAverageRating: 4.6,
          amazonRatingsCount: 29,
          price: '',
          isbn: '9780736917728',
          title: "Raising a Daughter After God's Own Heart",
          subtitle: '',
          description:
            'Elizabeth George, bestselling author and mother of two daughters',
          thumbnail:
            'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          categories: ['Religion'],
          goodreadsAverageRating: 4.25,
          goodreadsRatingsCount: 149,
        },
      ];
      const resultState = bookshelfReducer(initialState, {
        type: types.FETCH_BOOKSHELF_SUCCESS,
        bookshelf,
      });
      expect(resultState.bookshelf).toEqual(bookshelf);
    });
    it('sets saveStatus to failure on FETCH_BOOKSHELF_HAS_ERRORED', () => {
      const resultState = bookshelfReducer(initialState, {
        type: types.FETCH_BOOKSHELF_HAS_ERRORED,
        hasErrored: true,
        error: 'error',
      });
      expect(resultState.hasErrored).toEqual(true);
      expect(resultState.error).toEqual('error');
    });
  });
  describe('INSERT_MODIFIED_BOOK_SUCCESS', () => {
    it('should return modifiedBooklist if existing book from bookshelf', () => {
      const modifiedBook = [
        {
          amazonAverageRating: 4.4,
          amazonRatingsCount: 340,
          price: '',
          isbn: '9780310338130',
          title: 'Hands Free Mama',
          subtitle:
            'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
          description: '“Rachel Macy Stafford\'s post "The Day I Stopped',
          thumbnail:
            'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
          categories: ['Family & Relationships'],
          goodreadsAverageRating: 3.59,
          goodreadsRatingsCount: 3199,
          differences: [
            {
              key: 'title',
              currentValue: 'Hands Free Mama',
              newValue: 'Hands Free Mam',
            },
          ],
          _id: '5c959b90cc9ec5d1b4e96491',
          adjustedRating: 4.0692698947939245,
        },
      ];
      const state = Object.assign({}, initialState, {
        modifiedBooklist: [
          {
            amazonAverageRating: 4.4,
            amazonRatingsCount: 340,
            price: '',
            isbn: '9780310338130',
            title: 'Hands Free Mama',
            subtitle:
              'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
            description: '“Rachel Macy Stafford\'s post "The Day I Stopped',
            thumbnail:
              'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
            categories: ['Family & Relationships'],
            goodreadsAverageRating: 3.59,
            goodreadsRatingsCount: 3199,
            differences: [
              {
                key: 'title',
                currentValue: 'Hands Free Mama',
                newValue: 'Hands Free Mam',
              },
            ],
            _id: '5c959b90cc9ec5d1b4e96491',
            adjustedRating: 4.0692698947939245,
          },
          {
            amazonAverageRating: 4.6,
            amazonRatingsCount: 29,
            price: '',
            isbn: '9780736917728',
            title: "Raising a Daughter After God's Own Heart",
            subtitle: '',
            description:
              'Elizabeth George, bestselling author and mother of two daughters',
            thumbnail:
              'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
            categories: ['Religion'],
            goodreadsAverageRating: 4.25,
            goodreadsRatingsCount: 149,
            differences: [
              {
                key: 'title',
                currentValue: "Raising a Daughter After God's Own Heart1",
                newValue: "Raising a Daughter After God's Own Heart",
              },
            ],
            _id: '5c959505494f5dd029aeff74',
            adjustedRating: 4.23027758115467,
          },
        ],
        bookshelf: [
          {
            categories: ['Religion'],
            read: false,
            owned: false,
            _id: '5c959505494f5dd029aeff74',
            amazonAverageRating: 4.6,
            amazonRatingsCount: 29,
            price: '',
            isbn: '9780736917728',
            title: "Raising a Daughter After God's Own Heart1",
            subtitle: '',
            description:
              'Elizabeth George, bestselling author and mother of two daughters',
            thumbnail:
              'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
            goodreadsAverageRating: 4.25,
            goodreadsRatingsCount: 149,
            __v: 0,
            adjustedRating: 4.23027758115467,
          },
          {
            categories: ['Family & Relationships'],
            read: false,
            owned: false,
            _id: '5c959b90cc9ec5d1b4e96491',
            amazonAverageRating: 4.4,
            amazonRatingsCount: 340,
            price: '',
            isbn: '9780310338130',
            title: 'Hands Free Mama1',
            subtitle:
              'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
            description: '“Rachel Macy Stafford\'s post "The Day I Stopped',
            thumbnail:
              'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
            goodreadsAverageRating: 3.59,
            goodreadsRatingsCount: 3199,
            __v: 0,
            adjustedRating: 4.0692698947939245,
          },
        ],
      });
      const resultState = bookshelfReducer(state, {
        type: types.INSERT_MODIFIED_BOOK_SUCCESS,
        modifiedBook,
      });
      const newModifiedBooklist = [
        {
          _id: '5c959b90cc9ec5d1b4e96491',
          adjustedRating: 4.0692698947939245,
          amazonAverageRating: 4.4,
          amazonRatingsCount: 340,
          categories: ['Family & Relationships'],
          description: '“Rachel Macy Stafford\'s post "The Day I Stopped',
          differences: [
            {
              currentValue: 'Hands Free Mama',
              key: 'title',
              newValue: 'Hands Free Mam',
            },
          ],
          goodreadsAverageRating: 3.59,
          goodreadsRatingsCount: 3199,
          isbn: '9780310338130',
          price: '',
          subtitle:
            'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
          thumbnail:
            'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
          title: 'Hands Free Mama',
        },
        {
          _id: '5c959505494f5dd029aeff74',
          adjustedRating: 4.23027758115467,
          amazonAverageRating: 4.6,
          amazonRatingsCount: 29,
          categories: ['Religion'],
          description:
            'Elizabeth George, bestselling author and mother of two daughters',
          differences: [
            {
              currentValue: "Raising a Daughter After God's Own Heart1",
              key: 'title',
              newValue: "Raising a Daughter After God's Own Heart",
            },
          ],
          goodreadsAverageRating: 4.25,
          goodreadsRatingsCount: 149,
          isbn: '9780736917728',
          price: '',
          subtitle: '',
          thumbnail:
            'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          title: "Raising a Daughter After God's Own Heart",
        },
        {
          _id: '5c959b90cc9ec5d1b4e96491',
          adjustedRating: 4.0692698947939245,
          amazonAverageRating: 4.4,
          amazonRatingsCount: 340,
          categories: ['Family & Relationships'],
          description: '“Rachel Macy Stafford\'s post "The Day I Stopped',
          differences: [
            {
              currentValue: 'Hands Free Mama',
              key: 'title',
              newValue: 'Hands Free Mam',
            },
          ],
          goodreadsAverageRating: 3.59,
          goodreadsRatingsCount: 3199,
          isbn: '9780310338130',
          price: '',
          subtitle:
            'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
          thumbnail:
            'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
          title: 'Hands Free Mama',
        },
      ];
      expect(resultState.modifiedBooklist).toEqual(newModifiedBooklist);
    });
  });
  describe('ADD_BOOK_TO_BOOKSHELF_SUCCESS', () => {
    it('can add book to bookshelf', () => {
      const resultState = bookshelfReducer(initialState, {
        type: types.ADD_BOOK_TO_BOOKSHELF_SUCCESS,
        booklist: [],
      });
      expect(resultState.booklist).toEqual([]);
      expect(resultState.saveStatus).toEqual({
        status: LOADING_STATUSES.success,
        message: 'Save Successful',
      });
    });
  });
  describe('FILTER_BOOKSHELF_SUCCESS', () => {
    it('can update filters', () => {
      const filters = [
        { key: 'unread', value: true },
        { key: 'owned', value: false },
      ];
      const resultState = bookshelfReducer(initialState, {
        type: types.FILTER_BOOKSHELF_SUCCESS,
        filters,
      });
      expect(resultState.filters).toEqual(filters);
    });
  });
  describe('ADD_BOOK_TO_BOOKSHELF_FAILURE', () => {
    it('can add book to bookshelf failure', () => {
      const resultState = bookshelfReducer(initialState, {
        type: types.ADD_BOOK_TO_BOOKSHELF_FAILURE,
      });
      expect(resultState.saveStatus).toEqual({
        status: LOADING_STATUSES.errored,
        message: 'Save Failed',
      });
    });
  });
  describe('UPDATE_BOOK_ON_BOOKSHELF_SUCCESS', () => {
    it('updates bookshelf', () => {
      const state = Object.assign({}, initialState, {
        modifiedBooklist: [
          {
            amazonAverageRating: 4.6,
            amazonRatingsCount: 29,
            price: '',
            isbn: '9780736917728',
            title: "Raising a Daughter After God's Own Heart",
            subtitle: '',
            description: 'Elizabeth George, bestselling author and mother',
            thumbnail:
              'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
            categories: ['Religion'],
            goodreadsAverageRating: 4.25,
            goodreadsRatingsCount: 149,
            differences: [
              {
                key: 'title',
                currentValue: "Raising a Daughter After God's Own Heart1",
                newValue: "Raising a Daughter After God's Own Heart",
              },
            ],
            _id: '5c959505494f5dd029aeff74',
            adjustedRating: 4.425,
          },
        ],
        bookshelf: [
          {
            categories: ['Religion'],
            read: false,
            owned: false,
            _id: '5c959505494f5dd029aeff74',
            amazonAverageRating: 4.6,
            amazonRatingsCount: 29,
            price: '',
            isbn: '9780736917728',
            title: "Raising a Daughter After God's Own Heart1",
            subtitle: '',
            description: 'Elizabeth George, bestselling author and mother',
            thumbnail:
              'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
            goodreadsAverageRating: 4.25,
            goodreadsRatingsCount: 149,
            __v: 0,
            adjustedRating: 4.425,
          },
        ],
      });
      const resultState = bookshelfReducer(state, {
        type: types.UPDATE_BOOK_ON_BOOKSHELF_SUCCESS,
        modifiedBooklist: [],
      });
      expect(resultState.modifiedBooklist).toEqual([]);
      expect(resultState.saveStatus).toEqual({
        status: LOADING_STATUSES.success,
        message: 'Save Successful',
      });
    });
  });
  describe('genres', () => {
    it('FETCH_BOOKSHELF_GENRES_SUCCESS', () => {
      const resultState = bookshelfReducer(initialState, {
        type: types.FETCH_BOOKSHELF_GENRES_SUCCESS,
        genres: ['test'],
      });
      expect(resultState.genres).toEqual(['test']);
    });
    it('FETCH_BOOKSHELF_GENRES_FAILURE', () => {
      const resultState = bookshelfReducer(initialState, {
        type: types.FETCH_BOOKSHELF_GENRES_FAILURE,
        error: 'error',
      });
      expect(resultState.error).toEqual('error');
    });
  });
  describe('deletes', () => {
    let booklist;
    beforeEach(() => {
      booklist = [
        {
          categories: ['Religion'],
          read: false,
          owned: false,
          _id: '5c959505494f5dd029aeff74',
          amazonAverageRating: 4.6,
          amazonRatingsCount: 29,
          price: '',
          isbn: '9780736917728',
          title: "Raising a Daughter After God's Own Heart1",
          subtitle: '',
          description:
            'Elizabeth George, bestselling author and mother of two daughters',
          thumbnail:
            'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          goodreadsAverageRating: 4.25,
          goodreadsRatingsCount: 149,
          __v: 0,
          adjustedRating: 4.23027758115467,
        },
        {
          categories: ['Family & Relationships'],
          read: false,
          owned: false,
          _id: '5c959b90cc9ec5d1b4e96491',
          amazonAverageRating: 4.4,
          amazonRatingsCount: 340,
          price: '',
          isbn: '9780310338130',
          title: 'Hands Free Mama1',
          subtitle:
            'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
          description: '“Rachel Macy Stafford\'s post "The Day I Stopped',
          thumbnail:
            'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
          goodreadsAverageRating: 3.59,
          goodreadsRatingsCount: 3199,
          __v: 0,
          adjustedRating: 4.0692698947939245,
        },
      ];
    });
    it('can delete book from booklist', () => {
      const state = Object.assign({}, initialState, {
        booklist,
      });
      const resultState = bookshelfReducer(state, {
        type: types.DELETE_BOOK_FROM_BOOKLIST_SUCCESS,
        deleteISBN: booklist[1].isbn,
      });
      expect(resultState.booklist).toEqual([booklist[0]]);
    });
    it('can delete book from bookshelf', () => {
      const state = Object.assign({}, initialState, {
        bookshelf: booklist,
      });
      const resultState = bookshelfReducer(state, {
        type: types.DELETE_BOOK_ON_BOOKSHELF_SUCCESS,
        deleteId: booklist[1]._id,
      });
      expect(resultState.bookshelf).toEqual([booklist[0]]);
    });
  });
});
