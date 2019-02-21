import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getAmazonBookService(isbns) {
  return axios
    .post(apiConfig.amazon, { isbns })
    .then(books => books.data)
    .catch(error => {
      throw error;
    });
}

export function getAmazonBookServiceSingle(isbn) {
  return axios
    .post(apiConfig.amazonV2, { isbn })
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
}
