const express = require('express');
const bookRoutes = express.Router();
const map = require('lodash').map;

const Book = require('../../models/Book');

bookRoutes.route('/').get((req, res) => {
  Book.find({}, function(err, books) {
    var bookshelf = [];

    books.forEach(function(book) {
      bookshelf.push(book);
    });

    res.send(bookshelf);
  });
});

bookRoutes.route('/genres').get((req, res) => res.json({ msg: 'Works' }));

bookRoutes.route('/add').post((req, res) => {
  //console.log(res.json());
  //const book = new Book(req.body);
  const books = map(req.body, book => {
    Book.find({ isbn: book.isbn }, { isbn: 1 }).limit(1);
    return new Book(book);
  });
  console.log('mongo insertMany', books);
  Book.insertMany(books, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      console.log('doc', doc);
      res.send(doc);
    }
  });
});

module.exports = bookRoutes;
