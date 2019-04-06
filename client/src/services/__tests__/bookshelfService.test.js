import axios from 'axios';
import {
  getBookshelfService,
  addBookshelfService,
  updateBookOnBookshelfService,
  deleteBookOnBookshelfService,
  getGenresBookshelfService,
} from '../bookshelfService';
import apiConfig from '../../config/apiConfig';
import MockAdapter from 'axios-mock-adapter';

describe('bookshelfService', () => {
  describe('getBookshelfService', () => {
    it('should get bookshelf with included genres', () => {
      const mock = new MockAdapter(axios);
      const booklist = { data: [{ title: 'title' }] };
      mock
        .onPost(apiConfig.bookshelf, ['Religion', 'Parenthood'])
        .reply(200, booklist);

      return getBookshelfService(['Religion', 'Parenthood']).then(resp => {
        expect(resp).toEqual(booklist);
      });
    });
    it('should get bookshelf without included genres passed in', () => {
      const mock = new MockAdapter(axios);
      const booklist = { data: [{ title: 'title' }] };
      mock.onPost(apiConfig.bookshelf).reply(200, booklist);

      return getBookshelfService().then(resp => {
        expect(resp).toEqual(booklist);
      });
    });
    it('should throw error', () => {
      const mock = new MockAdapter(axios);
      const errorMessage = 'Request failed with status code 400';
      mock.onPost(apiConfig.bookshelf).reply(400, errorMessage);

      return getBookshelfService().catch(resp => {
        expect(resp.message).toEqual(errorMessage);
      });
    });
  });
  describe('addBookshelfService', () => {
    it('should get bookshelf with included genres', () => {
      const mock = new MockAdapter(axios);
      const booklist = { data: [{ title: 'title' }] };
      mock
        .onPost(`${apiConfig.bookshelf}/add`, booklist.data)
        .reply(200, booklist);

      return addBookshelfService(booklist.data).then(resp => {
        expect(resp).toEqual(booklist);
      });
    });
    it('should throw error', () => {
      const mock = new MockAdapter(axios);
      const errorMessage = 'Request failed with status code 400';
      mock.onPost(`${apiConfig.bookshelf}/add`).reply(400, errorMessage);

      return addBookshelfService().catch(resp => {
        expect(resp.message).toEqual(errorMessage);
      });
    });
  });
  describe('updateBookOnBookshelfService', () => {
    it('should update book on bookshelf ', () => {
      const mock = new MockAdapter(axios);
      const booklist = { data: [{ title: 'title' }] };
      mock
        .onPut(`${apiConfig.bookshelf}/update/5c9d7c34bc300b4070e9d9c9`, {
          title: "Raising a Daughter After God's Own Heart1",
        })
        .reply(200, booklist);

      return updateBookOnBookshelfService('5c9d7c34bc300b4070e9d9c9', {
        title: "Raising a Daughter After God's Own Heart1",
      }).then(resp => {
        expect(resp.data).toEqual(booklist);
      });
    });
    it('should throw 404 error with no id passed', () => {
      const mock = new MockAdapter(axios);
      const errorMessage = 'Request failed with status code 404';
      mock.onPut(`${apiConfig.bookshelf}/update/`).reply(404, errorMessage);

      return updateBookOnBookshelfService().catch(resp => {
        expect(resp.message).toEqual(errorMessage);
      });
    });
    it('should throw 400 error', () => {
      const mock = new MockAdapter(axios);
      const errorMessage = 'Request failed with status code 400';
      mock
        .onPut(`${apiConfig.bookshelf}/update/5c9d7c34bc300b4070e9d9c9`)
        .reply(400, errorMessage);

      return updateBookOnBookshelfService('5c9d7c34bc300b4070e9d9c9').catch(
        resp => {
          expect(resp.message).toEqual(errorMessage);
        }
      );
    });
  });
  describe('deleteBookOnBookshelfService', () => {
    it('should delete book on bookshelf ', () => {
      const mock = new MockAdapter(axios);
      const booklist = { data: [{ title: 'title' }] };
      mock
        .onDelete(`${apiConfig.bookshelf}/delete/5c9d7c34bc300b4070e9d9c9`)
        .reply(200, booklist);

      return deleteBookOnBookshelfService('5c9d7c34bc300b4070e9d9c9').then(
        resp => {
          expect(resp.data).toEqual(booklist);
        }
      );
    });
    it('should throw 404 error with no id passed', () => {
      const mock = new MockAdapter(axios);
      const errorMessage = 'Request failed with status code 404';
      mock.onDelete(`${apiConfig.bookshelf}/delete/`).reply(404, errorMessage);

      return deleteBookOnBookshelfService().catch(resp => {
        expect(resp.message).toEqual(errorMessage);
      });
    });
    it('should throw 400 error', () => {
      const mock = new MockAdapter(axios);
      const errorMessage = 'Request failed with status code 400';
      mock
        .onDelete(`${apiConfig.bookshelf}/delete/5c9d7c34bc300b4070e9d9c9`)
        .reply(400, errorMessage);

      return deleteBookOnBookshelfService('5c9d7c34bc300b4070e9d9c9').catch(
        resp => {
          expect(resp.message).toEqual(errorMessage);
        }
      );
    });
  });
  describe('getGenresBookshelfService', () => {
    it('should get genres ', () => {
      const mock = new MockAdapter(axios);
      const genres = { data: ['Genre1', 'Genre2'] };
      mock.onGet(`${apiConfig.bookshelf}/genres`).reply(200, genres);

      return getGenresBookshelfService().then(resp => {
        expect(resp.data).toEqual(genres.data);
      });
    });
    it('should throw 400 error', () => {
      const mock = new MockAdapter(axios);
      const errorMessage = 'Request failed with status code 400';
      mock.onGet(`${apiConfig.bookshelf}/genres`).reply(400, errorMessage);

      return getGenresBookshelfService().catch(resp => {
        expect(resp.message).toEqual(errorMessage);
      });
    });
  });
});
