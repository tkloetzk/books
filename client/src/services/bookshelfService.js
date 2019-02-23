import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getBookshelfService(excludedGenres) {
  return axios
    .post(apiConfig.bookshelf, excludedGenres)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
}
export function addBookshelfService(booklist) {
  return axios
    .post(`${apiConfig.bookshelf}/add`, booklist)
    .then(res => console.log(res.data))
    .catch(error => {
      throw error;
    });
}
