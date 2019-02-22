const express = require('express');
const bookRoutes = express.Router();
const map = require('lodash').map;

const Book = require('../../models/Book');

bookRoutes.route('/').post((req, res) => {
  Book.find({ categories: { $nin: req.body } }, function(err, books) {
    var bookshelf = [];

    books.forEach(function(book) {
      bookshelf.push(book);
    });

    res.send(bookshelf);
  });
});

bookRoutes.route('/add').post((req, res) => {
  const books = map(req.body, book => {
    Book.find({ isbn: book.isbn }, { isbn: 1 }).limit(1);
    return new Book(book);
  });
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
