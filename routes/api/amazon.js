const express = require('express');
const rp = require('request-promise');
const get = require('lodash').get;
const resultParse = require('../../nodejs/amazon/resultParse');

const url = 'https://www.amazon.com/s/rstripbooks&ie=UTF8&keywords=';

const router = express.Router();

router.post('/v1', (req, res) => {
  const isbnArray = get(req.body, 'isbns').split(','); // use lodash
  console.log(isbnArray);
  rp(url)
    .then(html =>
      Promise.all(isbnArray.map(isbns => resultParse(url + isbns, isbns)))
    )
    .then(books => {
      res.send({ books });
      console.log(books);
    })
    .catch(err => {
      // handle error
      console.log(err);
    });
});

module.exports = router;
