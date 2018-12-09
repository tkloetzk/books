const rp = require("request-promise");
const $ = require("cheerio");

const resultParse = function(url, isbn) {
  return rp(url)
    .then(html => ({
      name: $(
        ".a-size-medium.s-inline.s-access-title.a-text-normal",
        html
      ).text(),
      rating: $("i.a-icon.a-icon-star > span", html)
        .text()
        .split(" o")[0],
      reviews: $("div.a-column.a-span5.a-span-last > div > a", html).text(),
      price: $(".a-offscreen", html).text(),
      image: $("a.a-link-normal.a-text-normal > img", html).attr("src"),
      href: $("a.a-link-normal.a-text-normal", html).attr("href"),
      isbn
      // section: $('.s-item-container', html)
    }))
    .catch(err => {
      // handle error
    });
};

module.exports = resultParse;
