import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getBookshelfService() {
  return axios
    .get(apiConfig.bookshelf)
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

export function getGennresService() {
  return axios
    .get(`${apiConfig.bookshelf}/genres`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
}
