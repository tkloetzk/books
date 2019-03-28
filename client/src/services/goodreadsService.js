import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getGoodreadsSingleBooksService(booklist) {
  return axios
    .get(`${apiConfig.goodreads}/${booklist}`)
    .then(booklist => booklist.data)
    .catch(error => {
      throw error;
    });
}
