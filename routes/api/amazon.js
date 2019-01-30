const express = require('express');
const rp = require('request-promise');
const get = require('lodash/get');
const resultParse = require('../../nodejs/amazon/resultParse');
const request = require('request');
const $ = require('cheerio');

const url = 'https://www.amazon.com/s/rstripbooks&ie=UTF8&keywords=';

const router = express.Router();

router.post('/v1', (req, res) => {
  const isbnArray = get(req.body, 'isbns').split(',');

  // const apiCall = isbn => {
  //   return new Promise(async (resolve, reject) => {
  //     await Promise.delay(1000);
  //     resolve(resultParse(isbn));
  //   });
  // };
  // Promise.map(
  //   isbnArray,
  //   async query => {
  //     console.log(await apiCall(query));
  //   },
  //   { concurrency: 1 }
  // ).then(test => console.log('then', test));

  // isbnArray
  //   .map(isbn => resultParse(isbn))
  //   .reduce((p, f) => p.then(f), Promise.resolve())
  //   .then(books => console.log('books', books));
  Promise.all(isbnArray.map(isbn => resultParse(isbn)))
    .then(books => {
      res.send({ books });
    })
    .catch(err => {
      // handle error
      console.log('amazon err', err);
    });
});

router.post('/v2', (req, res) => {
  const isbn = get(req.body, 'isbn');
  const url =
    'http://api.scraperapi.com/?key=90d416faaa0849a3aac0e060f6faf854&url=' +
    encodeURIComponent(
      `https://www.amazon.com/s/ref=sr_nr_i_0?fst=as%3Aoff&rh=k%3A${isbn}%2Ci%3Astripbooks&keywords=${isbn}&ie=UTF8`
    );

  request(
    {
      method: 'GET',
      url,
      headers: {
        Accept: 'application/json',
      },
    },
    function(error, response, html) {
      console.log('Status:', response.statusCode);
      console.log('Error:', error);

      const keywordSelector = `a[href*="keywords=${isbn}"]`;

      const book = {
        title: $(
          `${keywordSelector} > .a-size-medium.s-inline.s-access-title.a-text-normal`,
          html
        ).text(),
        amazonAverageRating: parseFloat(
          $('span[data-a-popover*="average-customer-review"]', html)
            .text()
            .split(' o')[0]
        ),
        amazonRatingsCount: parseInt(
          $(
            `a[href*="keywords=${isbn}#customerReviews"].a-size-small.a-link-normal.a-text-normal`,
            html
          )
            .text()
            .replace(',', '')
        ),
        price: $(`${keywordSelector} > .a-offscreen`, html).text(),
        image: $(`${keywordSelector} > img`, html).attr('src'),
        href: $(
          `${keywordSelector}.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal`,
          html
        ).attr('href'),
        isbn,
      };
      console.log(book);
      res.send({ book });
    }
  );
});

module.exports = router;
