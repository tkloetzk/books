import axios from 'axios';
import { getGoogleBookService } from '../googleService';
import apiConfig from '../../config/apiConfig';
import MockAdapter from 'axios-mock-adapter';

describe('getGoogleBookService', () => {
  it('should get google book with isbn', () => {
    const mock = new MockAdapter(axios);
    const googleBook = { title: 'title' };
    mock.onGet(`${apiConfig.google}/123456789`).reply(200, googleBook);

    return getGoogleBookService('123456789').then(resp => {
      expect(resp).toEqual(googleBook);
    });
  });
  it('should throw error', () => {
    const mock = new MockAdapter(axios);
    const errorMessage = 'Request failed with status code 400';
    mock.onGet(`${apiConfig.google}/123456789`).reply(400, errorMessage);

    return getGoogleBookService('123456789').catch(resp => {
      expect(resp.message).toEqual(errorMessage);
    });
  });
});
