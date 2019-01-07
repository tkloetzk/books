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
