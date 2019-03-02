import apiConfig from '../config/apiConfig';
import axios from 'axios';
import sortBooklist from '../util/calculator';

export function getBookshelfService(excludedGenres) {
  return axios
    .post(apiConfig.bookshelf, excludedGenres)
    .then(res => sortBooklist(res.data))
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

export function updateBookOnBookshelfService(id, fields) {
  return axios
    .put(`${apiConfig.bookshelf}/update/${id}`, fields)
    .then(res => console.log(res.data))
    .catch(error => {
      throw error;
    });
}
