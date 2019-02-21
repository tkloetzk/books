const express = require('express');
const bookRoutes = express.Router();
const map = require('lodash').map;

const Book = require('../../models/Book');

bookRoutes.route('/').get((req, res) => {
  console.log('get all books');
  Book.find({}, function(err, books) {
    var bookshelf = [];

    books.forEach(function(book) {
      console.log('book', book);
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
  console.log(books);
  //Book.insertMany(books);
  // console.log('book', book);
  res.json({ books });
});

module.exports = bookRoutes;
