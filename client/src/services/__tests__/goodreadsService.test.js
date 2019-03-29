import axios from 'axios';
import { getGoodreadsSingleBooksService } from '../goodreadsService';
import apiConfig from '../../config/apiConfig';
import MockAdapter from 'axios-mock-adapter';

describe('getGoodreadsSingleBooksService', () => {
  it('should get goodreads book with isbn', () => {
    const mock = new MockAdapter(axios);
    const goodreadsBook = { title: 'title' };
    mock.onGet(`${apiConfig.goodreads}/123456789`).reply(200, goodreadsBook);

    return getGoodreadsSingleBooksService('123456789').then(resp => {
      expect(resp).toEqual(goodreadsBook);
    });
  });
  it('should throw error', () => {
    const mock = new MockAdapter(axios);
    const errorMessage = 'Request failed with status code 400';
    mock.onGet(`${apiConfig.goodreads}/123456789`).reply(400, errorMessage);

    return getGoodreadsSingleBooksService('123456789').catch(resp => {
      expect(resp.message).toEqual(errorMessage);
    });
  });
});
