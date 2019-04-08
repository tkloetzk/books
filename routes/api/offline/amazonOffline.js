const express = require('express');
const router = express.Router();
const get = require('lodash/get')

router.post('/v1', (req, res) => {
  // const isbnArray = get(req.body, 'isbns').split(',');
  //
  // Promise.all(isbnArray.map(isbn => resultParse(isbn)))
  //   .then(books => {
  //     res.send({ books });
  //   })
  //   .catch(err => {
  //     // handle error
  //     console.error('amazon err', err);
  //   });
});

router.post('/v2', (req, res) => {
  const isbn = get(req.body, 'isbn');

  const book = {
    amazonAverageRating: Number((Math.random() * (5 - 1) + 1).toFixed(2)),
    amazonRatingsCount: Math.floor(Math.random() * 5000),
    price: `$${(Math.random() * (14 - 1) + 1).toFixed(2)}`,
    isbn,
  }
  res.send({ book });
});

module.exports = router;
