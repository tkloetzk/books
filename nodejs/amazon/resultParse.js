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
      return {
        title: $(
          '.a-size-medium.s-inline.s-access-title.a-text-normal',
          html
        ).text(),
        amazonAverageRating: parseFloat(
          $('i.a-icon.a-icon-star > span', html)
            .text()
            .split(' o')[0]
        ),
        amazonRatingsCount: parseInt(
          $('div.a-column.a-span5.a-span-last > div > a', html).text()
        ),
        price: $('.a-offscreen', html).text(),
        image: $('a.a-link-normal.a-text-normal > img', html).attr('src'),
        href: $('a.a-link-normal.a-text-normal', html).attr('href'),
        isbn,
      };
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = resultParse;
