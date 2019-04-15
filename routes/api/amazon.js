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

  Promise.all(isbnArray.map(isbn => resultParse(isbn)))
    .then(books => {
      res.send({ books });
    })
    .catch(err => {
      // handle error
      console.error('amazon err', err);
    });
});

router.post('/v2', (req, res) => {
  // const api = '90d416faaa0849a3aac0e060f6faf854'
  const api = 'ad7f80a474b68485cc2b6f22485fcd5f';
  const isbn = get(req.body, 'isbn');
  const url =
    `http://api.scraperapi.com/?key=${api}&url=` +
    encodeURIComponent(
      `https://www.amazon.com/s/ref=sr_st_review-rank?keywords=${isbn}&rh=i%3Aaps%2Ck%3A${isbn}&sort=review-rank`
      // `https://www.amazon.com/s/ref=sr_nr_i_0?fst=as%3Aoff&rh=k%3A${isbn}%2Ci%3Astripbooks&keywords=${isbn}&ie=UTF8`
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
      console.info('Status:', response.statusCode);
      console.error('Error:', error);
      if (!error) {
        const keywordSelector = `a[href*="keywords=${isbn}"]`;
        const book = {
          amazonAverageRating: parseFloat(
            $('span[data-a-popover*="average-customer-review"]', html)
              .text()
              .split(' o')[0]
          ),
          amazonRatingsCount: parseInt(
            $('span[data-a-popover*="average-customer-review"]', html)
              .parent()
              .next()
              .text()
              .trim()
              .replace(',', '')
          ),
          price: $(`${keywordSelector} > .a-offscreen`, html).text(),
          // href: $(
          //   `${keywordSelector}.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal`,
          //   html
          // ).attr('href'),
          isbn,
        };
        //   console.log(book);
        res.send({ book });
      } else {
        console.error(error);
        res.error({ msg: error });
      }
    }
  );
});

module.exports = router;
