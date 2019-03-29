import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getAmazonBookService(isbn) {
  return axios
    .post(apiConfig.amazonV2, { isbn })
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
}
