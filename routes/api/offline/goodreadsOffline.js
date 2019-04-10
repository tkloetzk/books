const express = require('express');
const get = require('lodash/get')
const forEach = require('lodash/forEach')

const router = express.Router();

router.get('/v1/:isbn', (req, res) => {
  const isbn = get(req.params, 'isbn');
  res.send({
    goodreadsAverageRating: Number((Math.random() * (5 - 1) + 1).toFixed(2)),
    goodreadsRatingsCount: Math.floor(Math.random() * 5000),
    isbn,
  });
});
module.exports = router;
