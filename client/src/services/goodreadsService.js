import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getGoodreadsBooksService(booklist) {
  return axios
    .post(`${apiConfig.goodreads}/bookshelf`, booklist)
    .then(booklist => booklist.data)
    .catch(error => {
      throw error;
    });
}

export function getGoodreadsSingleBooksService(booklist) {
  return axios
    .get(`${apiConfig.goodreads}/${booklist}`)
    .then(booklist => booklist.data)
    .catch(error => {
      throw error;
    });
}
