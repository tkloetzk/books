const express = require('express');
const books = require('google-books-search');
const router = express.Router();
const get = require('lodash/get');

router.get('/v1/:isbn', (req, res) => {
  books.search(req.params.isbn, function(error, books) {
    if (!error) {
      const subtitle = get(books[0], 'subtitle', '');
      const categories = get(books[0], 'categories', 'undefined');
      const book = {
        title: books[0].title,
        isbn: req.params.isbn,
        subtitle,
        description: books[0].description,
        thumbnail: books[0].thumbnail,
        categories,
      };
      res.send(book);
    } else {
      console.error(error);
      res.error({ msg: error });
    }
  });
});
module.exports = router;
