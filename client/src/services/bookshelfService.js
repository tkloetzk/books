import apiConfig from '../config/apiConfig';
import axios from 'axios';
import sortBooklist from '../util/calculator';

export function getBookshelfService(includedGenres) {
  return axios
    .post(apiConfig.bookshelf, includedGenres)
    .then(res => sortBooklist(res.data))
    .catch(error => {
      throw error;
    });
}
export function addBookshelfService(booklist) {
  return axios.post(`${apiConfig.bookshelf}/add`, booklist).catch(error => {
    throw error;
  });
}

export function updateBookOnBookshelfService(id, fields) {
  return axios
    .put(`${apiConfig.bookshelf}/update/${id}`, fields)
    .catch(error => {
      throw error;
    });
}
