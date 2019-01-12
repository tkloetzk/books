const rp = require('request-promise');
const $ = require('cheerio');

const resultParse = isbn => {
  const url =
    'http://api.scraperapi.com/?key=90d416faaa0849a3aac0e060f6faf854&url=' +
    encodeURIComponent(
      `https://www.amazon.com/s/ref=sr_nr_i_0?fst=as%3Aoff&rh=k%3A${isbn}%2Ci%3Astripbooks&keywords=${isbn}&ie=UTF8`
    );
  return rp(url)
    .then(html => {
      const keywordSelector = `a[href*="keywords=${isbn}"]`;
      return {
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
        image: $(`${keywordSelector} > img`, html).src,
        href: $(
          `${keywordSelector}.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal`,
          html
        ).attr('href'),
        isbn,
      };
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = resultParse;
