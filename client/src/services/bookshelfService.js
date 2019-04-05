import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getBookshelfService(includedGenres = []) {
  return axios
    .post(apiConfig.bookshelf, includedGenres)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
}
export function addBookshelfService(booklist) {
  return axios
    .post(`${apiConfig.bookshelf}/add`, booklist)
    .then(res => res.data)
    .catch(error => {
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

export function deleteBookOnBookshelfService(id) {
  return axios.delete(`${apiConfig.bookshelf}/delete/${id}`).catch(error => {
    throw error;
  });
}

export function getGenresBookshelfService() {
  return axios.get(`${apiConfig.bookshelf}/genres`).then(res => res.data).catch(error => {throw error})
}
