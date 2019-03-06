const express = require('express');
const bookRoutes = express.Router();
const map = require('lodash').map;
const { ObjectId } = require('mongodb');
const Book = require('../../models/Book');

bookRoutes.route('/').post((req, res) => {
  const param = req.body.length ? { categories: { $in: req.body } } : {};
  Book.find(param, function(err, books) {
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
  Book.insertMany(books, (err, books) => {
    if (err) {
      console.log('error mongo', err);
      res.send(err);
    } else {
      console.log('mongo saved', books);
      res.send(books);
    }
  });
});

bookRoutes.route('/update/:id').put((req, res) => {
  Book.updateMany(
    { _id: ObjectId(req.params.id) },
    { $set: req.body },
    (err, books) => {
      if (err) {
        console.log('error mongo', err);
        res.send(err);
      } else {
        console.log('mongo saved', books);
        res.send(books);
      }
    }
  );
});

module.exports = bookRoutes;
