import apiConfig from '../config/apiConfig';
import axios from 'axios';

export function getGoodreadsBookService(isbns) {
  return axios
    .get(`${apiConfig.goodreads}/${isbns}`)
    .then(books => books.data)
    .catch(error => {
      throw error;
    });
}

export function getGoodreadsBooksService(booklist) {
  return axios
    .post(`${apiConfig.goodreads}/bookshelf`, booklist)
    .then(booklist => console.log(booklist))
    .catch(error => {
      throw error;
    });
}
