const express = require('express');
const router = express.Router();
const randomWords = require('random-words');
const startCase = require('lodash/startCase');
const map = require('lodash/map');
const forEach = require('lodash/forEach');

const randomCategories = randomWords({ exactly: 4, maxLength: 5 });
const categories = map(global.bookshelf, book =>
  map(book.categories, category => category.toString()).toString()
).concat(randomCategories);

router.get('/v1/:isbn', (req, res) => {
  const book = {
    title: startCase(randomWords({ exactly: 3, join: ' ' })),
    isbn: req.params.isbn,
    subtitle: startCase(randomWords({ exactly: 7, join: ' ' })),
    description: randomWords({ exactly: 45, join: ' ' }),
    thumbnail: '', // TODO: Add thumbnail
    categories: categories[Math.floor(Math.random() * categories.length)],
  };
  res.send(book);
});
module.exports = router;
