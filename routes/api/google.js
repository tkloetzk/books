const express = require('express');
const books = require('google-books-search');
const router = express.Router();
const get = require('lodash/get');

router.get('/v1/:isbn', (req, res) => {
  books.search(req.params.isbn, function(error, books) {
    if (!error) {
      // TODO: This needed? Use schema/model?
      const subtitle = get(books[0], 'subtitle', '');
      const book = {
        title: books[0].title,
        isbn: req.params.isbn,
        subtitle: subtitle,
        description: books[0].description,
        thumbnail: books[0].thumbnail,
        categories: books[0].categories,
      };
      res.send(book);
    } else {
      console.error(error);
      res.error({ msg: error });
    }
  });
});
module.exports = router;
