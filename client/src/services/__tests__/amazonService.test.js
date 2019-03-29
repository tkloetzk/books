import axios from 'axios';
import { getAmazonBookService } from '../amazonService';
import apiConfig from '../../config/apiConfig';
import MockAdapter from 'axios-mock-adapter';

describe('getAmazonBookService', () => {
  it('should get amazon book with isbn', () => {
    const mock = new MockAdapter(axios);
    const amazonBook = { title: 'title' };
    mock
      .onPost(`${apiConfig.amazonV2}`, { isbn: '123456789' })
      .reply(200, amazonBook);

    return getAmazonBookService('123456789').then(resp => {
      expect(resp).toEqual(amazonBook);
    });
  });
  it('should throw error', () => {
    const mock = new MockAdapter(axios);
    const errorMessage = 'Request failed with status code 400';
    mock
      .onPost(`${apiConfig.amazonV2}`, { isbn: '123456789' })
      .reply(400, errorMessage);

    return getAmazonBookService('123456789').catch(resp => {
      expect(resp.message).toEqual(errorMessage);
    });
  });
});
