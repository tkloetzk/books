const express = require('express');
const bookRoutes = express.Router();
const _ = require('lodash')
const forEach = require('lodash/forEach')
const map = require('lodash/map')
const isEqual = require('lodash/isEqual')
const remove = require('lodash/remove')

global.bookshelf = [
  {
    categories: ['Motherhood', 'Baby'],
    _id: '5c801a9f4549aac8fe03f088',
    amazonAverageRating: 4.4,
    amazonRatingsCount: 340,
    price: '',
    isbn: '9780310338130',
    title: 'Hands Free Mama1',
    owned: false,
    read: false,
    subtitle:
      'A Guide to Putting Down the Phone, Burning the To-Do List, and Letting Go of Perfection to Grasp What Really Matters!',
    description:
      '“Rachel Macy Stafford\'s post "The Day I Stopped Saying Hurry Up" was a true phenomenon on The Huffington Post, igniting countless conversations online and off about freeing ourselves from the vicious cycle of keeping up with our overstuffed agendas. Hands Free Mama has the power to keep that conversation going and remind us that we must not let our lives pass us by.” --Arianna Huffington, Chair, President, and Editor-in-Chief of the Huffington Post Media Group, nationally syndicated columnist, and author of thirteen books http://www.huffingtonpost.com/ DISCOVER THE POWER, JOY, AND LOVE of Living “Hands Free” If technology is the new addiction, then multi-tasking is the new marching order. We check our email while cooking dinner, send a text while bathing the kids, and spend more time looking into electronic screens than into the eyes of our loved ones. With our never-ending to-do lists and jam-packed schedules, it’s no wonder we’re distracted. But this isn’t the way it has to be. In July 2010, special education teacher and mother Rachel Macy Stafford decided enough was enough. Tired of losing track of what matters most in life, Rachel began practicing simple strategies that enabled her to momentarily let go of largely meaningless distractions and engage in meaningful soul-to-soul connections. She started a blog to chronicle her endeavors and soon saw how both external and internal distractions had been sabotaging her happiness and preventing her from bonding with the people she loves most. Hands Free Mama is the digital society’s answer to finding balance in a media-saturated, perfection-obsessed world. It doesn’t mean giving up all technology forever. It doesn’t mean forgoing our jobs and responsibilities. What it does mean is seizing the little moments that life offers us to engage in real and meaningful interaction. It means looking our loved ones in the eye and giving them the gift of our undivided attention, leaving the laundry till later to dance with our kids in the rain, and living a present, authentic, and intentional life despite a world full of distractions. So join Rachel and go hands-free. Discover what happens when you choose to open your heart—and your hands—to the possibilities of each God-given moment.',
    thumbnail:
      'http://books.google.com/books/content?id=cYFKAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    goodreadsAverageRating: 3.59,
    goodreadsRatingsCount: 3182,
    __v: 0,
  },
  {
    categories: ['Religion'],
    _id: '5c806393df78d5e84f8388ad',
    amazonAverageRating: 4.6,
    amazonRatingsCount: 20,
    price: '',
    owned: false,
    read: true,
    isbn: '9780736917728',
    title: "Raising a Daughter After God's Own Heart",
    subtitle: '',
    description:
      'Elizabeth George, bestselling author and mother of two daughters, provides biblical insight and guidance for every mom who wants to lead their daughter to a godly life through example, study, and prayer. Elizabeth includes questions to draw moms and daughter closer as together they pursue spiritual priorities and God s heart."',
    thumbnail:
      'http://books.google.com/books/content?id=K_AhmQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    goodreadsAverageRating: 4.24,
    goodreadsRatingsCount: 148,
    __v: 0,
  },
  {
    categories: ['Family & Relationships'],
    _id: '5c83043936c4b64ed32877f1',
    amazonAverageRating: 4.4,
    amazonRatingsCount: 252,
    price: '',
    isbn: '9781400079094',
    title: 'Operating Instructions1',
    owned: false,
    read: true,
    subtitle: "A Journal Of My Son's First Year",
    description:
      "A single mother and writer grappling alone with the problems of a newborn baby presents a vivid account of the confusion, joys, sorrows, and struggles of the first year in her son's life. Reprint. 20,000 first printing.",
    thumbnail:
      'http://books.google.com/books/content?id=MiKz2RreyecC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    goodreadsAverageRating: 4.19,
    goodreadsRatingsCount: 21506,
    __v: 0,
  },
  {
    categories: ['Baby'],
    _id: '5c83043936c4b64ed32877f2',
    amazonAverageRating: 4.3,
    amazonRatingsCount: 3594,
    price: '',
    isbn: '9781932740080',
    owned: true,
    read: false,
    title: 'On Becoming Baby Wise',
    subtitle:
      'Book One : the Classic Reference Guide Utilized by Over 1,000,000 Parents Worldwide',
    description:
      '"Discover the positive prescription for curing sleepless nights and fussy babies. Recommended by doctors across the country." - Back cover.',
    thumbnail:
      'http://books.google.com/books/content?id=oE_eA2icdiYC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    goodreadsAverageRating: 3.61,
    goodreadsRatingsCount: 11162,
    __v: 0,
  },
]

bookRoutes.route('/').post((req, res) => {
  if (req.body.length) {
    const filteredBookshelf = [];
    forEach(global.bookshelf, book => {
      forEach(req.body, category => {
        if (book.categories.includes(category)) {
          filteredBookshelf.push(book);
        }
      });
    });
    res.send(filteredBookshelf);
  } else {
    res.send(global.bookshelf);
  }
});

bookRoutes.route('/add').post((req, res) => {
  const books = map(req.body, book => {
    Book.find({ isbn: book.isbn }, { isbn: 1 }).limit(1);
    return new Book(book);
  });
  global.bookshelf = global.bookshelf.concat(books)
  res.send(books);
});


bookRoutes.route('/update/:id').put((req, res) => {
 forEach(global.bookshelf, book => {
    if (isEqual(book._id.toString(), req.params.id)) {
      forEach(Object.keys(req.body), key => {
        book[key] = req.body[key]
      })
   }
 })
 res.send(global.bookshelf)
});

bookRoutes.route('/delete/:id').delete((req, res) => {
  console.log('deleting', req.params);

  remove(global.bookshelf, book => book._id.toString() === req.params.id)
  res.send(global.bookshelf)
});

bookRoutes.route('/genres').get((req, res) => {
  const genres = []
  forEach(global.bookshelf, book =>
    forEach(book.categories, category => {
      if (!genres.includes(category)) {
        return genres.push(category.toString())
      }
    })
  );
  res.send(genres);
});

module.exports = bookRoutes;
